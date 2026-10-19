import type { TranslationKey } from '@/app/i18n/translation-key';
import { authSessionQueryOptions } from '@/features/auth/application/queries/auth-session.query';
import { USERS_QUERY_KEY } from '@/features/users/application/queries/users.query';
import { updateUserUseCase } from '@/features/users/application/use-cases/update-user.use-case';
import type { UserAccount, UserChanges } from '@/features/users/domain/user';
import {
  getUsersErrorDetail,
  getUsersNotice,
  toUserEditFormInput,
  userEditFormSchema,
  type UserEditFormData,
  type UserEditFormInput,
} from '@/features/users/presentation/models/users.model';
import { notify } from '@/shared/feedback/notify';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

// Motivo informado pelo Dialog quando o fechamento vem do botão "X".
const CLOSE_BUTTON_REASON = 'close-press';

type UseUserEditFormViewModelOptions = {
  user: UserAccount;
  onOpenChange: (open: boolean) => void;
};

export const useUserEditFormViewModel = ({
  onOpenChange,
  user,
}: UseUserEditFormViewModelOptions) => {
  const { t: tAuth } = useTranslation('auth');

  const { t } = useTranslation('users');

  const queryClient = useQueryClient();

  const { data: session } = useQuery(authSessionQueryOptions);

  const form = useForm<UserEditFormInput, unknown, UserEditFormData>({
    resolver: zodResolver(userEditFormSchema),
    defaultValues: toUserEditFormInput(user),
    mode: 'onTouched',
  });

  const {
    control,
    formState: { errors, isDirty, isSubmitted, touchedFields },
    getValues,
    handleSubmit,
    reset,
  } = form;

  // Avisa que trocar o e-mail exige nova verificação.
  const email = useWatch({ control, name: 'email' });

  const isChangingEmail = email.trim().toLowerCase() !== user.email;

  const {
    isPending,
    mutate,
    reset: resetMutation,
  } = useMutation({
    mutationFn: ({ changes, csrfToken }: { csrfToken: string; changes: UserChanges }) =>
      updateUserUseCase(csrfToken, user.id, changes),
    onSuccess: async (updated) => {
      await queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });

      onOpenChange(false);

      const emailChanged = updated.email !== user.email;

      notify.success({
        title: t('editForm.success.title'),
        description: emailChanged
          ? t('editForm.success.emailChanged', { email: updated.email })
          : t('editForm.success.description', { name: updated.name }),
      });
    },
    // A recusa vem do BFF (ex.: e-mail de outra conta) e aparece em toast com a mensagem dele.
    onError: (updateError) => {
      const notice = getUsersNotice(updateError);

      notify.error({
        title: t(`notices.${notice}.title`),
        description: getUsersErrorDetail(updateError) ?? t(`notices.${notice}.description`),
      });
    },
  });

  // O erro aparece depois do envio ou ao sair de um campo preenchido.
  const getFieldError = (name: keyof UserEditFormInput) => {
    const message = errors[name]?.message;

    const isVisible = isSubmitted || (Boolean(touchedFields[name]) && Boolean(getValues(name)));

    return message && isVisible ? tAuth(message as TranslationKey<'auth'>) : undefined;
  };

  const fieldErrors = {
    fullName: getFieldError('fullName'),
    phone: getFieldError('phone'),
    email: getFieldError('email'),
  };

  // O modal só fecha pelo botão "X" e nunca durante o envio.
  const handleOpenChange = (open: boolean, reason?: string) => {
    if (!open && (isPending || reason !== CLOSE_BUTTON_REASON)) {
      return;
    }

    onOpenChange(open);
  };

  const handleOpenChangeComplete = (open: boolean) => {
    if (open) {
      return;
    }

    reset();

    resetMutation();
  };

  const submit = handleSubmit((changes) => {
    if (isPending || !session) {
      return;
    }

    mutate({ csrfToken: session.csrfToken, changes });
  });

  return {
    fieldErrors,
    form,
    handleOpenChange,
    handleOpenChangeComplete,
    isChangingEmail,
    isSubmitDisabled: !isDirty || isPending,
    isSubmitting: isPending,
    submit,
  };
};
