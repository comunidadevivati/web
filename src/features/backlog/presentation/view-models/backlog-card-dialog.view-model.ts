import type { TranslationKey } from '@/app/i18n/translation-key';
import { authSessionQueryOptions } from '@/features/auth/application/queries/auth-session.query';
import { backlogCardsQueryOptions } from '@/features/backlog/application/queries/backlog.query';
import { saveBacklogCardUseCase } from '@/features/backlog/application/use-cases/save-backlog-card.use-case';
import {
  BacklogCardConflictError,
  BacklogCardNotFoundError,
  InvalidBacklogCardDataError,
  type BacklogCard,
  type BacklogCardStatus,
  type BacklogCardType,
} from '@/features/backlog/domain/backlog-card';
import {
  backlogCardFormSchema,
  backlogValidationMessages,
  getBacklogNotice,
  getServerDetail,
  toBacklogCardFormInput,
  type BacklogCardFormData,
  type BacklogCardFormInput,
} from '@/features/backlog/presentation/models/backlog.model';
import { useGlobalLoading } from '@/shared/feedback/global-loading';
import { notify } from '@/shared/feedback/notify';
import { useHasValidationErrors } from '@/shared/forms/use-has-validation-errors';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

const SERVER_FIELDS = ['title', 'description', 'type'] as const;

type UseBacklogCardDialogViewModelOptions = {
  // Card em edição; null cria um novo.
  card: BacklogCard | null;
  // Etapa em que o card novo nasce.
  status: BacklogCardStatus;
  onClose: () => void;
};

export const useBacklogCardDialogViewModel = ({
  card,
  onClose,
  status,
}: UseBacklogCardDialogViewModelOptions) => {
  const { t } = useTranslation('backlog');

  const queryClient = useQueryClient();

  const { data: session } = useQuery(authSessionQueryOptions);

  const cardForm = useForm<BacklogCardFormInput, unknown, BacklogCardFormData>({
    resolver: zodResolver(backlogCardFormSchema),
    defaultValues: toBacklogCardFormInput(card),
    mode: 'onTouched',
  });

  const hasValidationErrors = useHasValidationErrors(cardForm.control);

  const {
    control,
    formState: { errors },
    handleSubmit,
    setError,
    setValue,
  } = cardForm;

  const type = useWatch({ control, name: 'type' });

  const refreshCards = () => {
    return queryClient.invalidateQueries({ queryKey: backlogCardsQueryOptions().queryKey });
  };

  const { isPending, mutate } = useMutation({
    mutationFn: ({ csrfToken, data }: { csrfToken: string; data: BacklogCardFormData }) =>
      saveBacklogCardUseCase({ csrfToken, card, details: data, status }),
    onSuccess: async ({ title }) => {
      await refreshCards();

      notify.success({
        title: card ? t('dialog.success.editTitle') : t('dialog.success.createTitle'),
        description: t('dialog.success.description', { title }),
      });

      onClose();
    },
    onError: async (saveError) => {
      if (saveError instanceof InvalidBacklogCardDataError) {
        saveError.fields
          .filter((field): field is (typeof SERVER_FIELDS)[number] =>
            (SERVER_FIELDS as readonly string[]).includes(field),
          )
          .forEach((field) => {
            setError(field, { type: 'server', message: backlogValidationMessages.invalid });
          });
      }

      const notice = getBacklogNotice(saveError);

      notify.error({
        title: t(`notices.${notice}.title`),
        description: getServerDetail(saveError) ?? t(`notices.${notice}.description`),
      });

      // A versão aberta ficou para trás (ou o card sumiu): volta ao quadro atualizado.
      if (
        saveError instanceof BacklogCardConflictError ||
        saveError instanceof BacklogCardNotFoundError
      ) {
        await refreshCards();

        onClose();
      }
    },
  });

  useGlobalLoading(isPending);

  const getFieldError = (name: keyof BacklogCardFormInput) => {
    const message = errors[name]?.message;

    return message ? t(message as TranslationKey<'backlog'>) : undefined;
  };

  const changeType = (value: BacklogCardType) => {
    setValue('type', value, { shouldDirty: true, shouldValidate: true });
  };

  const submit = handleSubmit((data) => {
    if (isPending || !session) {
      return;
    }

    mutate({ csrfToken: session.csrfToken, data });
  });

  return {
    hasValidationErrors,
    cardForm,
    changeType,
    getFieldError,
    isEditing: card !== null,
    isSubmitting: isPending,
    submit,
    type,
  };
};
