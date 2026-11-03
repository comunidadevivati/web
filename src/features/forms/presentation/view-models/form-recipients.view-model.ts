import {
  emailGroupQueryOptions,
  emailRecipientsQueryOptions,
} from '@/features/communication/application/queries/communication.query';
import { isValidEmail } from '@/features/communication/domain/email-group';
import { MAX_RECIPIENT_EMAILS, type EmailGroup } from '@/features/forms/domain/form';
import { useQueries, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

// Destinatários gravados no formulário: grupos completos (acompanham o grupo) mais contas e e-mails
// escolhidos um a um.
export type FormRecipientsValue = {
  groupIds: string[];
  accountIds: string[];
  emails: string[];
};

// Um e-mail da lista: conta elegível (com nome) ou e-mail avulso.
export type RecipientEntry = {
  email: string;
  accountId: string | null;
  name: string | null;
};

export type GroupSelection = 'all' | 'some' | 'none';

export type RecipientSort = 'recent' | 'asc' | 'desc';

export type EmailIssue = 'invalid' | 'duplicate' | 'tooMany';

// Espera depois da última tecla antes de aplicar a pesquisa.
const SEARCH_DEBOUNCE_MS = 2000;

// Junta entradas sem repetir e-mail; a conta prevalece sobre o avulso com o mesmo endereço.
const mergeEntries = (entries: readonly RecipientEntry[]) => {
  const byEmail = new Map<string, RecipientEntry>();

  for (const entry of entries) {
    const current = byEmail.get(entry.email);

    if (!current || (!current.accountId && entry.accountId)) {
      byEmail.set(entry.email, entry);
    }
  }

  return [...byEmail.values()];
};

const matches = (value: string | null, term: string) =>
  value !== null && value.toLowerCase().includes(term);

type UseFormRecipientsViewModelOptions = {
  emailGroups: readonly EmailGroup[];
  value: FormRecipientsValue;
  onChange: (value: FormRecipientsValue) => void;
};

// Lista única de envio do formulário (ADR 0013 do backend). Marcar um grupo traz os e-mails dele
// para a lista; remover um e-mail deixa o grupo parcial. Ao gravar, grupo com todos os e-mails na
// lista vai como grupo (acompanha quem entrar depois); o restante vai como contas e e-mails avulsos.
export const useFormRecipientsViewModel = ({
  emailGroups,
  onChange,
  value,
}: UseFormRecipientsViewModelOptions) => {
  const groupQueries = useQueries({
    queries: emailGroups.map(({ id }) => emailGroupQueryOptions(id)),
  });

  const accountsQuery = useQuery(emailRecipientsQueryOptions());

  const isLoading = groupQueries.some(({ isPending }) => isPending) || accountsQuery.isPending;

  const hasError = groupQueries.some(({ isError }) => isError) || accountsQuery.isError;

  const isReady = !isLoading && !hasError;

  const accounts = new Map(
    (accountsQuery.data ?? []).map(({ email, id, name }) => [
      id,
      { email: email.toLowerCase(), accountId: id, name },
    ]),
  );

  // E-mails de cada grupo: contas elegíveis (ativas e verificadas) e avulsos.
  const groupEntries = new Map<string, RecipientEntry[]>();

  const ineligibleByGroup = new Map<string, number>();

  for (const { data: group } of groupQueries) {
    if (!group) {
      continue;
    }

    const members = group.memberAccountIds.flatMap((accountId) => {
      const account = accounts.get(accountId);

      return account ? [account] : [];
    });

    const external = group.externalEmails.map((email) => ({
      email: email.toLowerCase(),
      accountId: null,
      name: null,
    }));

    groupEntries.set(group.id, mergeEntries([...members, ...external]));

    ineligibleByGroup.set(group.id, group.memberAccountIds.length - members.length);
  }

  // Contas gravadas que deixaram de ser elegíveis: não aparecem, mas continuam gravadas.
  const hiddenAccountIds = value.accountIds.filter((id) => !accounts.has(id));

  // Lista montada a partir do que está gravado, até a primeira alteração.
  const [edited, setEdited] = useState<RecipientEntry[] | null>(null);

  const hydrate = (): RecipientEntry[] => {
    if (!isReady) {
      return [];
    }

    const explicitAccounts = value.accountIds.flatMap((id) => {
      const account = accounts.get(id);

      return account ? [account] : [];
    });

    return mergeEntries([
      ...value.emails.map((email) => ({ email, accountId: null, name: null })),
      ...explicitAccounts,
      ...value.groupIds.flatMap((id) => groupEntries.get(id) ?? []),
    ]);
  };

  const entries = edited ?? hydrate();

  const listed = new Set(entries.map(({ email }) => email));

  // Quantos e-mails do grupo estão na lista.
  const listedCountOf = (groupId: string) =>
    (groupEntries.get(groupId) ?? []).filter(({ email }) => listed.has(email)).length;

  const selectionOf = (groupId: string): GroupSelection => {
    const members = groupEntries.get(groupId) ?? [];

    const count = listedCountOf(groupId);

    if (members.length > 0 && count === members.length) {
      return 'all';
    }

    return count > 0 ? 'some' : 'none';
  };

  const commit = (next: RecipientEntry[]) => {
    setEdited(next);

    const emails = new Set(next.map(({ email }) => email));

    const fullGroupIds = emailGroups
      .map(({ id }) => id)
      .filter((id) => {
        const members = groupEntries.get(id) ?? [];

        return members.length > 0 && members.every(({ email }) => emails.has(email));
      });

    const covered = new Set(
      fullGroupIds.flatMap((id) => (groupEntries.get(id) ?? []).map(({ email }) => email)),
    );

    const rest = next.filter(({ email }) => !covered.has(email));

    onChange({
      groupIds: fullGroupIds,
      accountIds: [
        ...rest.flatMap(({ accountId }) => (accountId ? [accountId] : [])),
        ...hiddenAccountIds,
      ],
      emails: rest.filter(({ accountId }) => !accountId).map(({ email }) => email),
    });
  };

  // Grupo completo: desmarcar tira os e-mails dele (menos os de outro grupo completo). Parcial ou
  // vazio: marcar traz os que faltam, no topo da lista.
  const toggleGroup = (groupId: string) => {
    const members = groupEntries.get(groupId) ?? [];

    if (selectionOf(groupId) === 'all') {
      const kept = new Set(
        emailGroups
          .filter(({ id }) => id !== groupId && selectionOf(id) === 'all')
          .flatMap(({ id }) => (groupEntries.get(id) ?? []).map(({ email }) => email)),
      );

      const removed = new Set(
        members.map(({ email }) => email).filter((email) => !kept.has(email)),
      );

      commit(entries.filter(({ email }) => !removed.has(email)));

      return;
    }

    commit([...members.filter(({ email }) => !listed.has(email)), ...entries]);
  };

  const removeEmail = (email: string) => {
    commit(entries.filter((entry) => entry.email !== email));
  };

  // E-mail informado à mão: entra no topo da lista.
  const addEmail = (raw: string): EmailIssue | null => {
    const email = raw.trim().toLowerCase();

    if (!isValidEmail(email)) {
      return 'invalid';
    }

    if (listed.has(email)) {
      return 'duplicate';
    }

    if (entries.length >= MAX_RECIPIENT_EMAILS) {
      return 'tooMany';
    }

    commit([{ email, accountId: null, name: null }, ...entries]);

    return null;
  };

  // Pesquisa por nome do grupo, e-mail ou nome da pessoa: aplicada 2 s depois da última tecla, no
  // Enter ou no botão.
  const [searchInput, setSearchInput] = useState('');

  const [term, setTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setTerm(searchInput), SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const search = () => setTerm(searchInput);

  const clearSearch = () => {
    setSearchInput('');

    setTerm('');
  };

  const normalizedTerm = term.trim().toLowerCase();

  // Grupos de cada e-mail, pelo nome (ex.: "Louvor, Liderança").
  const groupNamesOf = (email: string) =>
    emailGroups
      .filter(({ id }) => (groupEntries.get(id) ?? []).some((entry) => entry.email === email))
      .map(({ name }) => name);

  const entryMatches = (entry: RecipientEntry) =>
    matches(entry.email, normalizedTerm) ||
    matches(entry.name, normalizedTerm) ||
    groupNamesOf(entry.email).some((name) => matches(name, normalizedTerm));

  const visibleGroups = emailGroups.filter(
    ({ id, name }) =>
      normalizedTerm === '' ||
      matches(name, normalizedTerm) ||
      (groupEntries.get(id) ?? []).some(
        (entry) => matches(entry.email, normalizedTerm) || matches(entry.name, normalizedTerm),
      ),
  );

  const [sort, setSort] = useState<RecipientSort>('recent');

  // "recent" mantém a ordem de inserção (o último inserido primeiro).
  const direction = sort === 'desc' ? -1 : 1;

  const sorted =
    sort === 'recent'
      ? entries
      : [...entries].sort((left, right) => direction * left.email.localeCompare(right.email));

  const visibleEntries = (normalizedTerm === '' ? sorted : sorted.filter(entryMatches)).map(
    (entry) => ({ ...entry, groupNames: groupNamesOf(entry.email) }),
  );

  return {
    addEmail,
    clearSearch,
    entryCount: entries.length,
    groupEntriesOf: (groupId: string) => groupEntries.get(groupId) ?? [],
    hasError,
    ineligibleCountOf: (groupId: string) => ineligibleByGroup.get(groupId) ?? 0,
    listedCountOf,
    isFiltering: normalizedTerm !== '',
    isLoading,
    isReady,
    removeEmail,
    retry: () => {
      for (const query of groupQueries) {
        if (query.isError) {
          void query.refetch();
        }
      }

      if (accountsQuery.isError) {
        void accountsQuery.refetch();
      }
    },
    search,
    searchInput,
    selectionOf,
    setSearchInput,
    setSort,
    sort,
    toggleGroup,
    visibleEntries,
    visibleGroups,
  };
};
