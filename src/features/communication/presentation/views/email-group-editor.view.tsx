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
  Spinner,
  Text,
  Textarea,
} from '@/components/ui';
import {
  EMAIL_GROUP_DESCRIPTION_MAX_LENGTH,
  EMAIL_GROUP_NAME_MAX_LENGTH,
  type EmailGroup,
} from '@/features/communication/domain/email-group';
import { useEmailGroupEditorViewModel } from '@/features/communication/presentation/view-models/email-group-editor.view-model';
import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';
import {
  ArrowLeftIcon,
  CircleAlertIcon,
  FileTextIcon,
  RefreshCwIcon,
  SaveIcon,
  TriangleAlertIcon,
  UsersRoundIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

type EmailGroupEditorViewProps = {
  // Grupo em edição; null cria um novo.
  group: EmailGroup | null;
};

const describedBy = (id: string, error?: string) => {
  return error ? `${id}-error` : undefined;
};

// Criação e edição do grupo: nome, descrição e as contas que recebem os e-mails, escolhidas entre
// todas as contas verificadas (membros ou não) em duas listas.
export const EmailGroupEditorView = ({ group }: EmailGroupEditorViewProps) => {
  const {
    changeMembers,
    editorForm,
    getFieldError,
    hasRecipientsError,
    isEditing,
    isLoadingRecipients,
    isSubmitting,
    memberAccountIds,
    recipientItems,
    refetchRecipients,
    removeUnavailable,
    submit,
    unavailableCount,
  } = useEmailGroupEditorViewModel({ group });

  const { register } = editorForm;

  const { t } = useTranslation('communication');

  const nameError = getFieldError('name');

  const descriptionError = getFieldError('description');

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
        <Heading className="text-2xl font-semibold tracking-tight text-foreground">
          {isEditing ? t('editor.editTitle') : t('editor.createTitle')}
        </Heading>

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
            </FieldGroup>
          </CardContent>
        </Card>

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
            disabled={isSubmitting || isLoadingRecipients}
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
