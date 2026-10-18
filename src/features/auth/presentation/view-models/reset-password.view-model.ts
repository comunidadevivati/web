import type { TranslationKey } from '@/app/i18n/translation-key';
import { resetPasswordUseCase } from '@/features/auth/application/use-cases/reset-password.use-case';
import { TooManyAttemptsError } from '@/features/auth/domain/auth-session';
import {
  InvalidPasswordResetTokenError,
  WeakPasswordResetError,
} from '@/features/auth/domain/password-recovery';
import {
  resetPasswordFormSchema,
  resetPasswordValidationMessages,
  type ResetPasswordFormData,
  type ResetPasswordNotice,
} from '@/features/auth/presentation/models/reset-password.model';
import {
  getPasswordRequirements,
  getPasswordStrength,
} from '@/shared/validation/password-strength';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

const getErrorNotice = (error: Error): ResetPasswordNotice | null => {
  if (error instanceof WeakPasswordResetError) {
    return null;
  }

  if (error instanceof InvalidPasswordResetTokenError) {
    return 'invalidLink';
  }

  if (error instanceof TooManyAttemptsError) {
    return 'tooManyAttempts';
  }

  return 'unavailable';
};

export const useResetPasswordViewModel = () => {
  const { token } = useSearch({ from: '/reset-password' });

  const [resetToken] = useState(token);

  const navigate = useNavigate();

  const { t } = useTranslation('auth');

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    mode: 'onTouched',
  });

  const {
    control,
    formState: { errors, isSubmitted, isValid, touchedFields },
    getFieldState,
    handleSubmit,
    register,
    setError,
    trigger,
  } = form;

  const values = useWatch({ control });

  const { password = '' } = values;

  const passwordStrength = getPasswordStrength(password);

  const passwordRequirements = getPasswordRequirements(password);

  useEffect(() => {
    if (!token) {
      return;
    }

    // O token continua somente na memória desta tela e sai da barra de endereço e do histórico.
    void navigate({ to: '/reset-password', search: {}, replace: true });
  }, [navigate, token]);

  const { data, error, isPending, isSuccess, mutate } = useMutation({
    mutationFn: (newPassword: string) =>
      resetPasswordUseCase({ password: newPassword, token: resetToken ?? '' }),
    onError: (resetError) => {
      if (resetError instanceof WeakPasswordResetError) {
        setError(
          'password',
          {
            type: 'server',
            message: resetPasswordValidationMessages.passwordWeak,
          },
          { shouldFocus: true },
        );
      }
    },
  });

  const notice: ResetPasswordNotice | null = !resetToken
    ? 'invalidLink'
    : error
      ? getErrorNotice(error)
      : null;

  const passwordRegistration = register('password', {
    onChange: () => {
      if (getFieldState('confirmPassword').isTouched) {
        void trigger('confirmPassword');
      }
    },
  });

  const getFieldError = (name: keyof ResetPasswordFormData) => {
    const message = errors[name]?.message;

    const isVisible = isSubmitted || (touchedFields[name] && Boolean(values[name]));

    return message && isVisible ? t(message as TranslationKey<'auth'>) : undefined;
  };

  const fieldErrors = {
    password: getFieldError('password'),
    confirmPassword: getFieldError('confirmPassword'),
  };

  const isSubmitDisabled = !isValid || isPending || !resetToken;

  const submit = handleSubmit(({ password: newPassword }) => {
    if (isSubmitDisabled) {
      return;
    }

    mutate(newPassword);
  });

  const goToLogin = () => {
    void navigate({ to: '/login', replace: true });
  };

  return {
    fieldErrors,
    form,
    goToLogin,
    isSubmitDisabled,
    isSubmitting: isPending,
    isSuccess,
    notice,
    passwordRegistration,
    passwordRequirements,
    passwordStrength,
    submit,
    successMessage: data?.message,
  };
};
