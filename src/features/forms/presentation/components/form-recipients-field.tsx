import { StatusBadge } from '@/components/molecules';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Box,
  Button,
  buttonVariants,
  Checkbox,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Spinner,
  Text,
} from '@/components/ui';
import { EmailGroupTypeBadge } from '@/features/communication/presentation/components/email-group-type-badge';
import { MAX_RECIPIENT_EMAILS, type EmailGroup } from '@/features/forms/domain/form';
import { EmailGroupEmailsDialog } from '@/features/forms/presentation/components/email-group-emails-dialog';
import {
  useFormRecipientsViewModel,
  type EmailIssue,
  type FormRecipientsValue,
  type RecipientSort,
} from '@/features/forms/presentation/view-models/form-recipients.view-model';
import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';
import {
  CircleAlertIcon,
  EyeIcon,
  MailPlusIcon,
  PlusIcon,
  RefreshCwIcon,
  SearchIcon,
  XIcon,
} from 'lucide-react';
import { useState, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';

const SORTS: RecipientSort[] = ['recent', 'asc', 'desc'];

type FormRecipientsFieldProps = {
  emailGroups: EmailGroup[];
  isLoadingGroups: boolean;
  hasGroupsError: boolean;
  onRetryGroups: () => void;
  value: FormRecipientsValue;
  onChange: (value: FormRecipientsValue) => void;
  disabled: boolean;
  // Recusa do servidor, já traduzida.
  error?: string;
};

// Destinatários do formulário: pesquisa, grupos (marcar traz os e-mails do grupo; completo, parcial
// ou vazio) e a lista única de e-mails, com inclusão manual, ordenação e remoção.
export const FormRecipientsField = ({
  disabled,
  emailGroups,
  error,
  hasGroupsError,
  isLoadingGroups,
  onChange,
  onRetryGroups,
  value,
}: FormRecipientsFieldProps) => {
  const { t } = useTranslation('forms');

  const {
    addEmail,
    clearSearch,
    entryCount,
    groupEntriesOf,
    hasError,
    ineligibleCountOf,
    isFiltering,
    isLoading,
    isReady,
    listedCountOf,
    removeEmail,
    retry,
    search,
    searchInput,
    selectionOf,
    setSearchInput,
    setSort,
    sort,
    toggleGroup,
    visibleEntries,
    visibleGroups,
  } = useFormRecipientsViewModel({ emailGroups, onChange, value });

  const [isAdding, setIsAdding] = useState(false);

  const [draft, setDraft] = useState('');

  const [issue, setIssue] = useState<EmailIssue | null>(null);

  const [dialogGroupId, setDialogGroupId] = useState<string | null>(null);

  const isLocked = disabled || !isReady;

  const dialogGroup = emailGroups.find(({ id }) => id === dialogGroupId);

  const groupDetailsOf = ({ id, name }: EmailGroup) => ({
    name,
    entries: groupEntriesOf(id),
    ineligibleCount: ineligibleCountOf(id),
  });

  // Nome da pessoa (conta) e grupos do e-mail; sem grupo, foi adicionado à mão.
  const originOf = (name: string | null, groupNames: string[]) => {
    const origin = groupNames.length > 0 ? groupNames.join(', ') : t('recipients.list.manual');

    return name ? `${name} · ${origin}` : origin;
  };

  const sortItems = SORTS.map((option) => ({
    value: option,
    label: t(`recipients.list.sort.${option}`),
  }));

  const submitDraft = () => {
    if (draft.trim() === '') {
      return;
    }

    const result = addEmail(draft);

    setIssue(result);

    if (!result) {
      setDraft('');
    }
  };

  const closeDraft = () => {
    setIsAdding(false);

    setDraft('');

    setIssue(null);
  };

  const handleDraftKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      submitDraft();
    }

    if (event.key === 'Escape') {
      event.preventDefault();

      closeDraft();
    }
  };

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      search();
    }
  };

  if (isLoadingGroups || (isLoading && !hasError)) {
    return (
      <Box className="flex justify-center py-6">
        <Spinner className="size-6 text-primary-strong" />
      </Box>
    );
  }

  if (hasGroupsError || hasError) {
    return (
      <Alert variant="destructive">
        <CircleAlertIcon />

        <AlertTitle>{t('recipients.unavailable.title')}</AlertTitle>

        <AlertDescription className="grid gap-3">
          {t('recipients.unavailable.description')}

          <Button
            className="w-fit"
            size="sm"
            type="button"
            variant="outline"
            onClick={() => {
              onRetryGroups();

              retry();
            }}
          >
            <RefreshCwIcon data-icon="inline-start" />
            {t('actions.retry')}
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  const draftMessage = issue
    ? t(`recipients.emails.${issue}`, { max: MAX_RECIPIENT_EMAILS })
    : null;

  return (
    <Box className="grid gap-6">
      <Box className="flex flex-col gap-2 sm:flex-row">
        <InputGroup className="sm:flex-1">
          <InputGroupAddon>
            <SearchIcon aria-hidden="true" />
          </InputGroupAddon>

          <InputGroupInput
            aria-label={t('recipients.search.label')}
            autoComplete="off"
            placeholder={t('recipients.search.placeholder')}
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            onKeyDown={handleSearchKeyDown}
          />

          {searchInput !== '' && (
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                aria-label={t('recipients.search.clear')}
                className="size-9"
                size="icon-sm"
                onClick={clearSearch}
              >
                <XIcon />
              </InputGroupButton>
            </InputGroupAddon>
          )}
        </InputGroup>

        <Button className="h-10" type="button" variant="outline" onClick={search}>
          <SearchIcon data-icon="inline-start" />
          {t('recipients.search.submit')}
        </Button>
      </Box>

      <Box className="grid gap-3">
        <Text className="text-sm font-semibold text-foreground">{t('recipients.legend')}</Text>

        {emailGroups.length === 0 && (
          <Box
            className="
              grid gap-3 rounded-xl border border-dashed border-border p-4 text-sm
              text-muted-foreground
            "
          >
            <Text>{t('recipients.noGroups.description')}</Text>

            <Box className="flex flex-wrap gap-2">
              {/* Nova aba: preserva o formulário em edição. */}
              <Link
                className={buttonVariants({ size: 'sm', variant: 'outline' })}
                rel="noopener"
                target="_blank"
                to="/comunicacao/emails/grupos/novo"
              >
                <PlusIcon data-icon="inline-start" />
                {t('recipients.noGroups.create')}
              </Link>

              <Button size="sm" type="button" variant="ghost" onClick={onRetryGroups}>
                <RefreshCwIcon data-icon="inline-start" />
                {t('recipients.noGroups.reload')}
              </Button>
            </Box>
          </Box>
        )}

        {emailGroups.length > 0 && visibleGroups.length === 0 && (
          <Text className="text-sm text-muted-foreground">{t('recipients.search.noGroups')}</Text>
        )}

        <Box className="grid gap-2 sm:grid-cols-2">
          {visibleGroups.map(({ description, id, name, type }) => {
            const selection = selectionOf(id);

            const memberCount = groupEntriesOf(id).length;

            return (
              <Box
                key={id}
                className={cn(
                  'flex items-start gap-3 rounded-lg border border-border p-3 transition-colors',
                  selection === 'all' && 'border-primary/50 bg-primary/10',
                  selection === 'some' && 'border-primary/30 bg-primary/5',
                )}
              >
                <Checkbox
                  // Parcial: o navegador mostra o "-" (indeterminate só existe via DOM).
                  ref={(element) => {
                    if (element) {
                      element.indeterminate = selection === 'some';
                    }
                  }}
                  aria-checked={selection === 'some' ? 'mixed' : selection === 'all'}
                  checked={selection === 'all'}
                  className="mt-0.5"
                  disabled={isLocked || memberCount === 0}
                  // Só a caixa seleciona: o card não é clicável.
                  aria-label={t('recipients.groups.selectNamed', { name })}
                  id={`form-recipient-${id}`}
                  onChange={() => toggleGroup(id)}
                />

                <Box className="grid min-w-0 flex-1 gap-1">
                  <Box className="flex flex-wrap items-center gap-2">
                    <Text className="text-sm font-semibold text-foreground">{name}</Text>

                    <EmailGroupTypeBadge type={type} />

                    {selection !== 'none' && (
                      <StatusBadge
                        label={t(`recipients.groups.listed.${selection}`, {
                          count: listedCountOf(id),
                          total: memberCount,
                        })}
                        tone={selection === 'all' ? 'success' : 'info'}
                      />
                    )}
                  </Box>

                  <Text className="text-xs text-muted-foreground">
                    {t('recipients.count', { count: memberCount })}
                    {description ? ` · ${description}` : ''}
                  </Text>
                </Box>

                <Button
                  aria-label={t('recipients.groups.viewEmailsNamed', { name })}
                  className="h-8 shrink-0"
                  size="sm"
                  type="button"
                  variant="ghost"
                  onClick={() => setDialogGroupId(id)}
                >
                  <EyeIcon data-icon="inline-start" />
                  {t('recipients.groups.viewEmails')}
                </Button>
              </Box>
            );
          })}
        </Box>
      </Box>

      <Box className="grid gap-3">
        <Box className="flex flex-wrap items-end justify-between gap-2">
          <Box className="grid gap-0.5">
            <Text className="text-sm font-semibold text-foreground">
              {t('recipients.list.title')}
            </Text>

            <Text className="text-xs text-muted-foreground">
              {isFiltering
                ? t('recipients.list.filtered', { shown: visibleEntries.length, total: entryCount })
                : t('recipients.list.count', { count: entryCount })}
            </Text>
          </Box>

          <Box className="flex flex-wrap items-center gap-2">
            <Select
              items={sortItems}
              value={sort}
              onValueChange={(next) => setSort((next as RecipientSort | null) ?? sort)}
            >
              <SelectTrigger aria-label={t('recipients.list.sort.label')} className="h-9 w-44">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {sortItems.map(({ label, value: option }) => (
                  <SelectItem key={option} value={option}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {!isAdding && (
              <Button
                className="h-9"
                disabled={isLocked}
                size="sm"
                type="button"
                variant="outline"
                onClick={() => setIsAdding(true)}
              >
                <MailPlusIcon data-icon="inline-start" />
                {t('recipients.emails.add')}
              </Button>
            )}
          </Box>
        </Box>

        {isAdding && (
          <Box className="flex gap-2">
            <Input
              // oxlint-disable-next-line jsx-a11y/no-autofocus -- o campo abre a pedido da pessoa
              autoFocus
              aria-describedby={draftMessage ? 'form-recipient-email-error' : undefined}
              aria-invalid={Boolean(issue)}
              aria-label={t('recipients.emails.label')}
              autoComplete="off"
              className="flex-1"
              disabled={isLocked}
              inputMode="email"
              placeholder={t('recipients.emails.placeholder')}
              type="text"
              value={draft}
              onChange={(event) => {
                setDraft(event.target.value);

                setIssue(null);
              }}
              onKeyDown={handleDraftKeyDown}
            />

            <Button
              className="h-10"
              disabled={isLocked || draft.trim() === ''}
              type="button"
              onClick={submitDraft}
            >
              <PlusIcon data-icon="inline-start" />
              {t('recipients.emails.confirm')}
            </Button>

            <Button
              aria-label={t('recipients.emails.close')}
              className="size-10"
              size="icon"
              type="button"
              variant="ghost"
              onClick={closeDraft}
            >
              <XIcon />
            </Button>
          </Box>
        )}

        {(draftMessage ?? error) && (
          <Text
            className="text-sm text-destructive italic"
            id="form-recipient-email-error"
            role="alert"
          >
            {draftMessage ?? error}
          </Text>
        )}

        {visibleEntries.length === 0 ? (
          <Text
            className="
              rounded-xl border border-dashed border-border p-4 text-center text-sm
              text-muted-foreground
            "
          >
            {isFiltering ? t('recipients.search.noEmails') : t('recipients.list.empty')}
          </Text>
        ) : (
          <Box
            className="
              flex max-h-96 flex-wrap content-start gap-2 overflow-y-auto rounded-xl border
              border-border p-3
            "
            role="list"
          >
            {visibleEntries.map(({ email, groupNames, name }) => (
              <Box
                key={email}
                className="
                  inline-flex max-w-full items-center gap-0.5 rounded-full border border-border
                  bg-muted py-0.5 pr-3 pl-0.5 text-sm text-foreground
                "
                role="listitem"
                // Origem (pessoa e grupos) ao passar o mouse; a badge mostra só o e-mail.
                title={originOf(name, groupNames)}
              >
                <Button
                  aria-label={t('recipients.emails.remove', { email })}
                  className="size-6 shrink-0 rounded-full"
                  disabled={isLocked}
                  size="icon"
                  type="button"
                  variant="ghost"
                  onClick={() => removeEmail(email)}
                >
                  <XIcon />
                </Button>

                <Text className="truncate">{email}</Text>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      <EmailGroupEmailsDialog
        group={dialogGroup ? groupDetailsOf(dialogGroup) : null}
        onClose={() => setDialogGroupId(null)}
      />
    </Box>
  );
};
