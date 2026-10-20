import { authSessionQueryOptions } from '@/features/auth/application/queries/auth-session.query';
import { MEMBERS_QUERY_KEY } from '@/features/members/application/queries/members.query';
import { createMembersFromUsersUseCase } from '@/features/members/application/use-cases/create-members-from-users.use-case';
import {
  getMembersNotice,
  summarizeMemberCreation,
  type MembersNotice,
} from '@/features/members/presentation/models/members.model';
import {
  USERS_QUERY_KEY,
  usersQueryOptions,
} from '@/features/users/application/queries/users.query';
import { UsersAccessDeniedError, type UserAccount } from '@/features/users/domain/user';
import { notify } from '@/shared/feedback/notify';
import { formatPhone } from '@/shared/validation/brazilian-phone';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

// Motivo informado pelo Dialog quando o fechamento vem do botão "X".
const CLOSE_BUTTON_REASON = 'close-press';

// Candidatas: contas com e-mail verificado que ainda não viraram Pessoa (nem membro).
const CANDIDATE_FILTERS = {
  status: null,
  emailVerified: true,
  hasPerson: false,
  search: null,
} as const;

type UseMemberCreateViewModelOptions = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const useMemberCreateViewModel = ({
  onOpenChange,
  open,
}: UseMemberCreateViewModelOptions) => {
  const { t } = useTranslation('members');

  const queryClient = useQueryClient();

  const { data: session } = useQuery(authSessionQueryOptions);

  const [selectedIds, setSelectedIds] = useState<ReadonlySet<string>>(() => new Set());

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isPending,
    refetch,
  } = useInfiniteQuery({ ...usersQueryOptions(CANDIDATE_FILTERS), enabled: open });

  const users = (data?.pages ?? []).flatMap(({ items }) => items);

  const notifyOutcome = (outcomes: Parameters<typeof summarizeMemberCreation>[0], name: string) => {
    const { created, failure, total } = summarizeMemberCreation(outcomes);

    if (created === total) {
      notify.success({
        title: t('memberCreate.success.title', { count: total }),
        description: t('memberCreate.success.description', { count: total, name }),
      });

      return;
    }

    if (failure) {
      notify.error({
        title: t('memberCreate.failure.title'),
        description: t(`memberCreate.failure.${failure}`, { name }),
      });

      return;
    }

    notify.error({
      title: created === 0 ? t('memberCreate.failure.title') : t('memberCreate.partial.title'),
      description: t('memberCreate.partial.description', { count: total, created }),
    });
  };

  const {
    isPending: isLinking,
    mutate,
    variables,
  } = useMutation({
    mutationFn: ({ csrfToken, targets }: { csrfToken: string; targets: UserAccount[] }) =>
      createMembersFromUsersUseCase(
        csrfToken,
        targets.map(({ id }) => id),
      ),
    onSuccess: (outcomes, { targets }) => {
      notifyOutcome(outcomes, targets[0]?.name ?? '');
    },
    onError: (linkError) => {
      const notice = getMembersNotice(linkError);

      notify.error({
        title: t(`notices.${notice}.title`),
        description: t(`notices.${notice}.description`),
      });
    },
    // Sucesso ou erro: o modal continua aberto, no estado inicial, com a lista atualizada.
    onSettled: async () => {
      setSelectedIds(new Set());

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: MEMBERS_QUERY_KEY }),
      ]);
    },
  });

  const linkingIds = new Set(isLinking ? (variables?.targets ?? []).map(({ id }) => id) : []);

  const candidates = users.map((user) => ({
    user,
    phone: user.phone ? formatPhone(user.phone) : null,
    isSelected: selectedIds.has(user.id),
    isLinking: linkingIds.has(user.id),
  }));

  const isAllSelected = users.length > 0 && users.every(({ id }) => selectedIds.has(id));

  const link = (targets: UserAccount[]) => {
    if (isLinking || !session || targets.length === 0) {
      return;
    }

    mutate({ csrfToken: session.csrfToken, targets });
  };

  const toggleSelected = (id: string) => {
    setSelectedIds((current) => {
      const next = new Set(current);

      if (!next.delete(id)) {
        next.add(id);
      }

      return next;
    });
  };

  const toggleAll = () => {
    setSelectedIds(isAllSelected ? new Set() : new Set(users.map(({ id }) => id)));
  };

  // "Vincular todos" converte somente as contas marcadas, e só com mais de uma marcada.
  const linkSelected = () => {
    if (selectedIds.size > 1) {
      link(users.filter(({ id }) => selectedIds.has(id)));
    }
  };

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  };

  const retry = () => {
    void refetch();
  };

  // O modal só fecha pelo botão "X" e nunca durante a conversão.
  const handleOpenChange = (nextOpen: boolean, reason?: string) => {
    if (!nextOpen && (isLinking || reason !== CLOSE_BUTTON_REASON)) {
      return;
    }

    onOpenChange(nextOpen);
  };

  // Descarta a seleção depois que o modal termina de fechar.
  const handleOpenChangeComplete = (nextOpen: boolean) => {
    if (!nextOpen) {
      setSelectedIds(new Set());
    }
  };

  const errorNotice: MembersNotice | null = error
    ? error instanceof UsersAccessDeniedError
      ? 'accessDenied'
      : 'unavailable'
    : null;

  return {
    candidates,
    canLinkSelected: selectedIds.size > 1 && !isLinking,
    errorNotice,
    handleOpenChange,
    handleOpenChangeComplete,
    hasNextPage,
    isAllSelected,
    isLinking,
    isLinkingSelected: isLinking && linkingIds.size > 1,
    isLoading: isPending,
    isLoadingMore: isFetchingNextPage,
    isRetrying: isFetching,
    link: (user: UserAccount) => link([user]),
    linkSelected,
    loadMore,
    retry,
    selectedCount: selectedIds.size,
    toggleAll,
    toggleSelected,
  };
};
