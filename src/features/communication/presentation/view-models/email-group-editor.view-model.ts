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
  type EmailGroup,
} from '@/features/communication/domain/email-group';
import {
  emailGroupEditorSchema,
  emailGroupValidationMessages,
  getCommunicationNotice,
  getServerDetail,
  toEmailGroupDetails,
  toEmailGroupEditorInput,
  type EmailGroupEditorData,
  type EmailGroupEditorInput,
} from '@/features/communication/presentation/models/email-groups.model';
import { useGlobalLoading } from '@/shared/feedback/global-loading';
import { notify } from '@/shared/feedback/notify';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useForm, useWatch, type FieldPath } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

const SERVER_FIELDS = ['name', 'description'] as const;

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

  const {
    control,
    formState: { errors, isSubmitted, touchedFields },
    getValues,
    handleSubmit,
    setError,
    setValue,
  } = editorForm;

  const memberAccountIds = useWatch({ control, name: 'memberAccountIds' });

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

  const unavailableCount = isLoadingRecipients
    ? 0
    : memberAccountIds.filter((id) => !knownIds.has(id)).length;

  const changeMembers = (ids: string[]) => {
    setValue('memberAccountIds', ids, { shouldDirty: true });
  };

  // Remove do grupo as contas que não podem mais receber e-mails.
  const removeUnavailable = () => {
    changeMembers(memberAccountIds.filter((id) => knownIds.has(id)));
  };

  const submit = handleSubmit(
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

  return {
    changeMembers,
    editorForm,
    getFieldError,
    hasRecipientsError,
    isEditing: group !== null,
    isLoadingRecipients,
    isSubmitting: isPending,
    memberAccountIds,
    recipientItems,
    refetchRecipients: () => void refetchRecipients(),
    removeUnavailable,
    submit,
    unavailableCount,
  };
};
