import type { TranslationKey } from '@/app/i18n/translation-key';
import { authSessionQueryOptions } from '@/features/auth/application/queries/auth-session.query';
import {
  changePasswordUseCase,
  type ChangePasswordInput,
} from '@/features/profile/application/use-cases/change-password.use-case';
import {
  createChangePasswordSchema,
  getSecurityNotice,
  type ChangePasswordFormData,
} from '@/features/profile/presentation/models/profile.model';
import { notify } from '@/shared/feedback/notify';
import {
  getPasswordRequirements,
  getPasswordStrength,
  getPersonalInfoTerms,
} from '@/shared/validation/password-strength';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { get, useForm, useWatch, type FieldPath } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

// Motivo informado pelo Dialog quando o fechamento vem do botão "X".
const CLOSE_BUTTON_REASON = 'close-press';

type UseChangePasswordViewModelOptions = {
  onOpenChange: (open: boolean) => void;
};

export const useChangePasswordViewModel = ({ onOpenChange }: UseChangePasswordViewModelOptions) => {
  const { t } = useTranslation('profile');

  const { data: session } = useQuery(authSessionQueryOptions);

  const personalInfo = getPersonalInfoTerms(session?.user.name ?? '', session?.user.email ?? '');

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(createChangePasswordSchema(personalInfo)),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
    mode: 'onTouched',
  });

  const {
    control,
    formState: { errors, isSubmitted, touchedFields },
    handleSubmit,
    register,
  } = form;

  const newPassword = useWatch({ control, name: 'newPassword' });

  const { isPending, mutate } = useMutation({
    mutationFn: (input: ChangePasswordInput) => changePasswordUseCase(input),
    onSuccess: ({ message }) => {
      onOpenChange(false);

      notify.success({
        title: t('changePassword.success.title'),
        description: message ?? t('changePassword.success.description'),
      });
    },
    onError: (error) => {
      const notice = getSecurityNotice(error);

      notify.error({
        title: t(`securityNotices.${notice}.title`),
        description: t(`securityNotices.${notice}.description`),
      });
    },
  });

  const getFieldError = (name: FieldPath<ChangePasswordFormData>) => {
    const message: unknown = get(errors, name)?.message;

    const isVisible = isSubmitted || Boolean(get(touchedFields, name));

    return typeof message === 'string' && isVisible
      ? t(message as TranslationKey<'profile'>)
      : undefined;
  };

  // O modal só fecha pelo botão "X" ou por Cancelar, e nunca durante o envio.
  const handleOpenChange = (open: boolean, reason?: string) => {
    if (!open && (isPending || reason !== CLOSE_BUTTON_REASON)) {
      return;
    }

    onOpenChange(open);
  };

  const cancel = () => {
    if (!isPending) {
      onOpenChange(false);
    }
  };

  const submit = handleSubmit(({ currentPassword, newPassword: password }) => {
    if (isPending || !session) {
      return;
    }

    mutate({ csrfToken: session.csrfToken, currentPassword, newPassword: password });
  });

  return {
    cancel,
    fieldErrors: {
      currentPassword: getFieldError('currentPassword'),
      newPassword: getFieldError('newPassword'),
      confirmPassword: getFieldError('confirmPassword'),
    },
    handleOpenChange,
    isSubmitting: isPending,
    passwordRequirements: getPasswordRequirements(newPassword),
    passwordStrength: getPasswordStrength(newPassword, personalInfo),
    register,
    submit,
  };
};
