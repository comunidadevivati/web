import type { TranslationKey } from '@/app/i18n/translation-key';
import { loginUseCase } from '@/features/auth/application/use-cases/login.use-case';
import { loginSchema, type LoginFormData } from '@/features/auth/presentation/models/login.model';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export const useLoginViewModel = () => {
  const navigate = useNavigate();

  const { t } = useTranslation('auth');

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onTouched',
  });

  const {
    formState: { isDirty, isSubmitting, isValid },
    handleSubmit,
  } = form;

  const isSubmitDisabled = !isDirty || !isValid || isSubmitting;

  // Mensagens do Zod são chaves de tradução do namespace "auth".
  const getFieldError = (message?: string) => {
    return message ? t(message as TranslationKey<'auth'>) : undefined;
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((currentValue) => !currentValue);
  };

  const submit = handleSubmit(async ({ email }) => {
    loginUseCase({
      email,
    });

    await navigate({
      to: '/dashboard',
    });
  });

  return {
    form,
    getFieldError,
    isPasswordVisible,
    isSubmitDisabled,
    submit,
    togglePasswordVisibility,
  };
};
