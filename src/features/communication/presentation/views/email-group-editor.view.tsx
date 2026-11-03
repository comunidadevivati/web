import { CardSectionHeader, FormField, TransferList } from '@/components/molecules';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Box,
  Button,
  buttonVariants,
  Card,
  CardContent,
  FieldGroup,
  Form,
  Heading,
  Input,
  Label,
  Radio,
  Spinner,
  Text,
  Textarea,
} from '@/components/ui';
import {
  EMAIL_GROUP_DESCRIPTION_MAX_LENGTH,
  EMAIL_GROUP_NAME_MAX_LENGTH,
  EMAIL_GROUP_TYPES,
  type EmailGroup,
} from '@/features/communication/domain/email-group';
import { EmailGroupTypeBadge } from '@/features/communication/presentation/components/email-group-type-badge';
import { useEmailGroupEditorViewModel } from '@/features/communication/presentation/view-models/email-group-editor.view-model';
import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';
import {
  ArrowLeftIcon,
  AtSignIcon,
  CircleAlertIcon,
  FileTextIcon,
  MailPlusIcon,
  RefreshCwIcon,
  SaveIcon,
  TriangleAlertIcon,
  UsersRoundIcon,
  XIcon,
} from 'lucide-react';
import type { KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';

type EmailGroupEditorViewProps = {
  // Grupo em edição; null cria um novo.
  group: EmailGroup | null;
};

const describedBy = (id: string, error?: string) => {
  return error ? `${id}-error` : undefined;
};

// Criação e edição do grupo: nome, descrição, tipo e os destinatários. Conforme o tipo, as contas
// verificadas (membros ou não) são escolhidas em duas listas e/ou os e-mails avulsos são informados à
// mão.
export const EmailGroupEditorView = ({ group }: EmailGroupEditorViewProps) => {
  const {
    addExternalEmails,
    changeExternalEmailDraft,
    changeMembers,
    changeType,
    discardedAccountCount,
    discardedEmailCount,
    editorForm,
    externalEmailDraft,
    externalEmails,
    externalEmailsFeedback,
    getFieldError,
    hasRecipientsError,
    isEditing,
    isLoadingRecipients,
    isSubmitting,
    memberAccountIds,
    recipientItems,
    refetchRecipients,
    removeAllExternalEmails,
    removeExternalEmail,
    removeUnavailable,
    showsAccounts,
    showsExternalEmails,
    submit,
    type,
    unavailableCount,
  } = useEmailGroupEditorViewModel({ group });

  const { register } = editorForm;

  const { t } = useTranslation('communication');

  const nameError = getFieldError('name');

  const descriptionError = getFieldError('description');

  // Inválidos e repetidos do último "Adicionar" aparecem no próprio campo.
  const feedbackMessage = externalEmailsFeedback && {
    count: externalEmailsFeedback.values.length,
    values: externalEmailsFeedback.values.join(', '),
  };

  const externalEmailsError =
    externalEmailsFeedback?.kind === 'invalid' && feedbackMessage
      ? t('externalEmails.invalid', feedbackMessage)
      : getFieldError('externalEmails');

  const externalEmailsDescription =
    externalEmailsFeedback?.kind === 'duplicates' && feedbackMessage
      ? t('externalEmails.duplicates', feedbackMessage)
      : t('externalEmails.hint');

  // Enter adiciona (sem enviar o formulário).
  const handleDraftKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      addExternalEmails();
    }
  };

  return (
    <Box className="grid gap-6">
      <Link
        className="
          inline-flex w-fit items-center gap-1.5 text-sm font-medium text-primary-strong
          hover:underline
        "
        to="/comunicacao/emails/grupos"
      >
        <ArrowLeftIcon aria-hidden="true" className="size-4" />
        {t('editor.back')}
      </Link>

      <Box className="min-w-0">
        <Box className="flex flex-wrap items-center gap-3">
          <Heading className="text-2xl font-semibold tracking-tight text-foreground">
            {isEditing ? t('editor.editTitle') : t('editor.createTitle')}
          </Heading>

          <EmailGroupTypeBadge type={type} />
        </Box>

        <Text className="mt-1 text-muted-foreground">
          {isEditing ? (group?.name ?? '') : t('editor.createSubtitle')}
        </Text>
      </Box>

      <Form className="grid gap-6" noValidate onSubmit={submit}>
        <Card className="border-border surface-card shadow-sm">
          <CardSectionHeader
            description={t('editor.sections.general.description')}
            icon={FileTextIcon}
            title={t('editor.sections.general.title')}
          />

          <CardContent>
            <FieldGroup className="gap-4">
              <FormField error={nameError} id="email-group-name" label={t('fields.name')}>
                <Input
                  id="email-group-name"
                  aria-describedby={describedBy('email-group-name', nameError)}
                  aria-invalid={Boolean(nameError)}
                  aria-required
                  autoComplete="off"
                  disabled={isSubmitting}
                  maxLength={EMAIL_GROUP_NAME_MAX_LENGTH}
                  placeholder={t('fields.namePlaceholder')}
                  type="text"
                  {...register('name')}
                />
              </FormField>

              <FormField
                error={descriptionError}
                id="email-group-description"
                label={t('fields.description')}
              >
                <Textarea
                  id="email-group-description"
                  aria-describedby={describedBy('email-group-description', descriptionError)}
                  aria-invalid={Boolean(descriptionError)}
                  disabled={isSubmitting}
                  maxLength={EMAIL_GROUP_DESCRIPTION_MAX_LENGTH}
                  placeholder={t('fields.descriptionPlaceholder')}
                  rows={3}
                  {...register('description')}
                />
              </FormField>

              <Box className="grid gap-2" role="radiogroup" aria-labelledby="email-group-type">
                <Text className="text-sm font-medium text-foreground" id="email-group-type">
                  {t('fields.type')}
                </Text>

                <Box className="grid gap-3 md:grid-cols-3">
                  {EMAIL_GROUP_TYPES.map((option) => {
                    const optionId = `email-group-type-${option}`;

                    return (
                      <Label
                        key={option}
                        className={cn(
                          `
                            flex cursor-pointer items-start gap-3 rounded-xl border border-border
                            p-4 font-normal transition-colors hover:border-primary/40
                          `,
                          type === option && 'border-primary bg-primary/5',
                        )}
                        htmlFor={optionId}
                      >
                        <Radio
                          checked={type === option}
                          className="mt-0.5"
                          disabled={isSubmitting}
                          id={optionId}
                          name="email-group-type"
                          onChange={() => changeType(option)}
                        />

                        <span className="grid gap-1">
                          <span className="text-sm font-semibold text-foreground">
                            {t(`groupTypes.${option}.label`)}
                          </span>

                          <span className="text-xs text-muted-foreground">
                            {t(`groupTypes.${option}.description`)}
                          </span>
                        </span>
                      </Label>
                    );
                  })}
                </Box>
              </Box>

              {(discardedAccountCount > 0 || discardedEmailCount > 0) && (
                <Alert>
                  <TriangleAlertIcon />

                  <AlertTitle>{t('editor.discarded.title')}</AlertTitle>

                  <AlertDescription>
                    {discardedAccountCount > 0
                      ? t('editor.discarded.accounts', { count: discardedAccountCount })
                      : t('editor.discarded.emails', { count: discardedEmailCount })}
                  </AlertDescription>
                </Alert>
              )}
            </FieldGroup>
          </CardContent>
        </Card>

        {showsAccounts && (
          <Card className="border-border surface-card shadow-sm">
            <CardSectionHeader
              description={t('editor.sections.recipients.description')}
              icon={UsersRoundIcon}
              title={t('editor.sections.recipients.title')}
            />

            <CardContent className="grid gap-4">
              {isLoadingRecipients && (
                <Box className="flex min-h-40 items-center justify-center">
                  <Spinner className="size-7 text-primary-strong" />
                </Box>
              )}

              {hasRecipientsError && (
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
                      onClick={refetchRecipients}
                    >
                      <RefreshCwIcon data-icon="inline-start" />
                      {t('actions.retry')}
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              {unavailableCount > 0 && (
                <Alert>
                  <TriangleAlertIcon />

                  <AlertTitle>{t('recipients.unavailableAccounts.title')}</AlertTitle>

                  <AlertDescription className="grid gap-3">
                    {t('recipients.unavailableAccounts.description', { count: unavailableCount })}

                    <Button
                      className="w-fit"
                      disabled={isSubmitting}
                      size="sm"
                      type="button"
                      variant="outline"
                      onClick={removeUnavailable}
                    >
                      {t('recipients.unavailableAccounts.remove')}
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              {!isLoadingRecipients && !hasRecipientsError && (
                <TransferList
                  disabled={isSubmitting}
                  id="email-group-recipients"
                  items={recipientItems}
                  labels={{
                    availableTitle: t('recipients.available'),
                    selectedTitle: t('recipients.selected'),
                    searchPlaceholder: t('recipients.searchPlaceholder'),
                    searchLabel: (listTitle) => t('recipients.searchLabel', { list: listTitle }),
                    empty: t('recipients.empty'),
                    noMatches: t('recipients.noMatches'),
                    count: (shown, total) =>
                      shown === total
                        ? t('recipients.count', { count: total })
                        : t('recipients.filteredCount', { shown, total }),
                    addChecked: t('recipients.addChecked'),
                    addAll: t('recipients.addAll'),
                    removeChecked: t('recipients.removeChecked'),
                    removeAll: t('recipients.removeAll'),
                  }}
                  selectedIds={memberAccountIds}
                  onChange={changeMembers}
                />
              )}
            </CardContent>
          </Card>
        )}

        {showsExternalEmails && (
          <Card className="border-border surface-card shadow-sm">
            <CardSectionHeader
              description={t('editor.sections.externalEmails.description')}
              icon={AtSignIcon}
              title={t('editor.sections.externalEmails.title')}
            />

            <CardContent className="grid gap-4">
              <FormField
                description={externalEmailsDescription}
                error={externalEmailsError}
                id="email-group-external-emails"
                label={t('externalEmails.label')}
              >
                <Box className="flex flex-col gap-2 sm:flex-row">
                  <Input
                    id="email-group-external-emails"
                    aria-describedby={
                      externalEmailsError
                        ? 'email-group-external-emails-error'
                        : 'email-group-external-emails-description'
                    }
                    aria-invalid={Boolean(externalEmailsError)}
                    autoComplete="off"
                    className="sm:flex-1"
                    disabled={isSubmitting}
                    inputMode="email"
                    placeholder={t('externalEmails.placeholder')}
                    type="text"
                    value={externalEmailDraft}
                    onChange={(event) => changeExternalEmailDraft(event.target.value)}
                    onKeyDown={handleDraftKeyDown}
                  />

                  <Button
                    className="h-10"
                    disabled={isSubmitting || externalEmailDraft.trim() === ''}
                    type="button"
                    variant="outline"
                    onClick={() => addExternalEmails()}
                  >
                    <MailPlusIcon data-icon="inline-start" />
                    {t('externalEmails.add')}
                  </Button>
                </Box>
              </FormField>

              <Box className="grid gap-2">
                <Box className="flex items-center justify-between gap-3">
                  <Text className="text-sm font-medium text-foreground">
                    {t('externalEmails.count', { count: externalEmails.length })}
                  </Text>

                  {externalEmails.length > 0 && (
                    <Button
                      disabled={isSubmitting}
                      size="sm"
                      type="button"
                      variant="ghost"
                      onClick={removeAllExternalEmails}
                    >
                      {t('externalEmails.removeAll')}
                    </Button>
                  )}
                </Box>

                {externalEmails.length === 0 ? (
                  <Text
                    className="
                      rounded-xl border border-dashed border-border p-4 text-center text-sm
                      text-muted-foreground
                    "
                  >
                    {t('externalEmails.empty')}
                  </Text>
                ) : (
                  <Box
                    className="
                      flex max-h-72 flex-wrap gap-2 overflow-y-auto rounded-xl border border-border
                      p-3
                    "
                    role="list"
                  >
                    {externalEmails.map((email) => (
                      <Box
                        key={email}
                        className="
                          inline-flex max-w-full items-center gap-1 rounded-full border
                          border-border bg-muted py-1 pr-1 pl-3 text-sm text-foreground
                        "
                        role="listitem"
                      >
                        <Text className="truncate">{email}</Text>

                        <Button
                          aria-label={t('externalEmails.remove', { email })}
                          className="size-6 rounded-full"
                          disabled={isSubmitting}
                          size="icon"
                          type="button"
                          variant="ghost"
                          onClick={() => removeExternalEmail(email)}
                        >
                          <XIcon className="size-3.5" />
                        </Button>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        )}

        <Box className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            className={cn(buttonVariants({ variant: 'outline' }), 'h-11 sm:px-5')}
            to="/comunicacao/emails/grupos"
          >
            {t('editor.cancel')}
          </Link>

          <Button
            aria-busy={isSubmitting}
            className="h-11 sm:px-5"
            disabled={isSubmitting || (showsAccounts && isLoadingRecipients)}
            type="submit"
          >
            {isSubmitting ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <SaveIcon data-icon="inline-start" />
            )}
            {isSubmitting ? t('editor.submitting') : t('editor.submit')}
          </Button>
        </Box>
      </Form>
    </Box>
  );
};
