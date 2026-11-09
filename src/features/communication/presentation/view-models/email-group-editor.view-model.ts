import type { TranslationKey } from '@/app/i18n/translation-key';
import type { TransferListItem } from '@/components/molecules';
import { authSessionQueryOptions } from '@/features/auth/application/queries/auth-session.query';
import {
  EMAIL_GROUPS_QUERY_KEY,
  emailRecipientsQueryOptions,
} from '@/features/communication/application/queries/communication.query';
import { saveEmailGroupUseCase } from '@/features/communication/application/use-cases/save-email-group.use-case';
import {
  EmailGroupConflictError,
  InvalidEmailGroupDataError,
  acceptsAccounts,
  acceptsExternalEmails,
  type EmailGroup,
  type EmailGroupType,
} from '@/features/communication/domain/email-group';
import {
  emailGroupEditorSchema,
  emailGroupValidationMessages,
  getCommunicationNotice,
  getServerDetail,
  parseExternalEmails,
  toEmailGroupDetails,
  toEmailGroupEditorInput,
  type EmailGroupEditorData,
  type EmailGroupEditorInput,
} from '@/features/communication/presentation/models/email-groups.model';
import { useGlobalLoading } from '@/shared/feedback/global-loading';
import { notify } from '@/shared/feedback/notify';
import { useHasValidationErrors } from '@/shared/forms/use-has-validation-errors';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useState, type BaseSyntheticEvent } from 'react';
import { useForm, useWatch, type FieldPath } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

const SERVER_FIELDS = ['name', 'description', 'externalEmails'] as const;

// Retorno do campo de e-mails avulsos após tentar adicionar (inválidos e repetidos ficam no campo).
export type ExternalEmailsFeedback =
  | { kind: 'invalid'; values: string[] }
  | { kind: 'duplicates'; values: string[] }
  | null;

type UseEmailGroupEditorViewModelOptions = {
  // Grupo em edição; null cria um novo.
  group: EmailGroup | null;
};

export const useEmailGroupEditorViewModel = ({ group }: UseEmailGroupEditorViewModelOptions) => {
  const { t } = useTranslation('communication');

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { data: session } = useQuery(authSessionQueryOptions);

  const {
    data: recipients = [],
    isError: hasRecipientsError,
    isPending: isLoadingRecipients,
    refetch: refetchRecipients,
  } = useQuery(emailRecipientsQueryOptions());

  const editorForm = useForm<EmailGroupEditorInput, unknown, EmailGroupEditorData>({
    resolver: zodResolver(emailGroupEditorSchema),
    defaultValues: toEmailGroupEditorInput(group),
    mode: 'onTouched',
  });

  const hasValidationErrors = useHasValidationErrors(editorForm.control);

  const {
    control,
    formState: { errors, isSubmitted, touchedFields },
    getValues,
    handleSubmit,
    setError,
    setValue,
  } = editorForm;

  const memberAccountIds = useWatch({ control, name: 'memberAccountIds' });

  const type = useWatch({ control, name: 'type' });

  const externalEmails = useWatch({ control, name: 'externalEmails' });

  // Texto ainda não adicionado no campo de e-mails avulsos.
  const [externalEmailDraft, setExternalEmailDraft] = useState('');

  const [externalEmailsFeedback, setExternalEmailsFeedback] =
    useState<ExternalEmailsFeedback>(null);

  const { isPending, mutate } = useMutation({
    mutationFn: ({ csrfToken, data }: { csrfToken: string; data: EmailGroupEditorData }) =>
      saveEmailGroupUseCase({ csrfToken, group, details: toEmailGroupDetails(data) }),
    onSuccess: async ({ name }) => {
      // Inclui a lista de grupos do editor de formulários (mesma raiz de chave).
      await queryClient.invalidateQueries({ queryKey: EMAIL_GROUPS_QUERY_KEY });

      notify.success({
        title: group ? t('editor.success.editTitle') : t('editor.success.createTitle'),
        description: t('editor.success.description', { name }),
      });

      await navigate({ to: '/comunicacao/emails/grupos' });
    },
    onError: async (saveError) => {
      // Campos recusados (ou nome repetido) ficam marcados no próprio formulário.
      if (
        saveError instanceof InvalidEmailGroupDataError ||
        saveError instanceof EmailGroupConflictError
      ) {
        saveError.fields
          .filter((field): field is (typeof SERVER_FIELDS)[number] =>
            (SERVER_FIELDS as readonly string[]).includes(field),
          )
          .forEach((field) => {
            setError(field, { type: 'server', message: emailGroupValidationMessages.invalid });
          });
      }

      const notice = getCommunicationNotice(saveError);

      notify.error({
        title: t(`notices.${notice}.title`),
        description: getServerDetail(saveError) ?? t(`notices.${notice}.description`),
      });

      // Na edição, versão desatualizada: recarrega o grupo.
      if (saveError instanceof EmailGroupConflictError && group && saveError.fields.length === 0) {
        await queryClient.invalidateQueries({ queryKey: EMAIL_GROUPS_QUERY_KEY });
      }
    },
  });

  useGlobalLoading(isPending);

  // O erro aparece depois do envio ou ao sair de um campo preenchido.
  const getFieldError = (name: FieldPath<EmailGroupEditorInput>) => {
    const message = errors[name as keyof typeof errors]?.message;

    const isVisible =
      isSubmitted ||
      (Boolean(touchedFields[name as keyof typeof touchedFields]) && Boolean(getValues(name)));

    return message && isVisible ? t(message as TranslationKey<'communication'>) : undefined;
  };

  const recipientItems: TransferListItem[] = recipients.map(({ email, id, isMember, name }) => ({
    id,
    label: name,
    description: email,
    badge: isMember ? t('recipients.memberBadge') : undefined,
  }));

  // Contas do grupo que não aparecem mais entre as disponíveis (suspensas, por exemplo).
  const knownIds = new Set(recipients.map(({ id }) => id));

  const showsAccounts = acceptsAccounts(type);

  const showsExternalEmails = acceptsExternalEmails(type);

  const unavailableCount =
    isLoadingRecipients || !showsAccounts
      ? 0
      : memberAccountIds.filter((id) => !knownIds.has(id)).length;

  // O que o tipo escolhido esconde e que sai do grupo ao salvar.
  const discardedAccountCount = showsAccounts ? 0 : memberAccountIds.length;

  const discardedEmailCount = showsExternalEmails ? 0 : externalEmails.length;

  const changeType = (value: EmailGroupType) => {
    setValue('type', value, { shouldDirty: true, shouldValidate: true });
  };

  const changeMembers = (ids: string[]) => {
    setValue('memberAccountIds', ids, { shouldDirty: true, shouldValidate: true });
  };

  // Remove do grupo as contas que não podem mais receber e-mails.
  const removeUnavailable = () => {
    changeMembers(memberAccountIds.filter((id) => knownIds.has(id)));
  };

  const changeExternalEmailDraft = (value: string) => {
    setExternalEmailDraft(value);

    setExternalEmailsFeedback(null);
  };

  // Adiciona os e-mails válidos do campo; os inválidos continuam nele para correção. Devolve false
  // quando sobrou algo inválido.
  const addExternalEmails = () => {
    const current = getValues('externalEmails');

    const { added, duplicates, invalid } = parseExternalEmails(externalEmailDraft, current);

    if (added.length > 0) {
      setValue('externalEmails', [...current, ...added], {
        shouldDirty: true,
        shouldValidate: true,
      });
    }

    setExternalEmailDraft(invalid.join(', '));

    if (invalid.length > 0) {
      setExternalEmailsFeedback({ kind: 'invalid', values: invalid });
    } else if (duplicates.length > 0) {
      setExternalEmailsFeedback({ kind: 'duplicates', values: duplicates });
    } else {
      setExternalEmailsFeedback(null);
    }

    return invalid.length === 0;
  };

  const removeExternalEmail = (email: string) => {
    setValue(
      'externalEmails',
      getValues('externalEmails').filter((item) => item !== email),
      { shouldDirty: true, shouldValidate: true },
    );
  };

  const removeAllExternalEmails = () => {
    setValue('externalEmails', [], { shouldDirty: true, shouldValidate: true });
  };

  const submitForm = handleSubmit(
    (data) => {
      if (isPending || !session) {
        return;
      }

      mutate({ csrfToken: session.csrfToken, data });
    },
    () => {
      notify.error({
        title: t('editor.invalid.title'),
        description: t('editor.invalid.description'),
      });
    },
  );

  // E-mails digitados e ainda não adicionados entram no grupo ao salvar; se algum for inválido, o
  // salvamento espera a correção.
  const submit = (event?: BaseSyntheticEvent) => {
    if (showsExternalEmails && externalEmailDraft.trim() !== '' && !addExternalEmails()) {
      event?.preventDefault();

      notify.error({
        title: t('editor.invalid.title'),
        description: t('externalEmails.invalidPending'),
      });

      return;
    }

    void submitForm(event);
  };

  return {
    hasValidationErrors,
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
    isEditing: group !== null,
    isLoadingRecipients,
    isSubmitting: isPending,
    memberAccountIds,
    recipientItems,
    refetchRecipients: () => void refetchRecipients(),
    removeAllExternalEmails,
    removeExternalEmail,
    removeUnavailable,
    showsAccounts,
    showsExternalEmails,
    submit,
    type,
    unavailableCount,
  };
};
