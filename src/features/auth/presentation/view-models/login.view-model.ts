import type { TranslationKey } from '@/app/i18n/translation-key';
import { authSessionQueryOptions } from '@/features/auth/application/queries/auth-session.query';
import { loginUseCase } from '@/features/auth/application/use-cases/login.use-case';
import {
  InvalidCredentialsError,
  TooManyAttemptsError,
  type LoginCredentials,
} from '@/features/auth/domain/auth-session';
import {
  loginFormSchema,
  type LoginFormData,
  type LoginNotice,
} from '@/features/auth/presentation/models/login.model';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

const getErrorNotice = (error: Error): LoginNotice => {
  if (error instanceof InvalidCredentialsError) {
    return 'invalidCredentials';
  }

  if (error instanceof TooManyAttemptsError) {
    return 'tooManyAttempts';
  }

  return 'unavailable';
};

export const useLoginViewModel = () => {
  const { reason } = useSearch({ from: '/login' });

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { t } = useTranslation('auth');

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onTouched',
  });

  const {
    control,
    formState: { errors, isSubmitted, touchedFields },
    handleSubmit,
    resetField,
    setValue,
  } = form;

  const values = useWatch({ control });

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const [hasRegistered, setHasRegistered] = useState(false);

  const {
    error,
    isPending,
    isSuccess,
    mutate,
    reset: resetLogin,
  } = useMutation({
    mutationFn: (credentials: LoginCredentials) => loginUseCase(credentials),
    onSuccess: async () => {
      // A sessão em cache (null) ficou obsoleta: o guard de /_authenticated consulta o BFF de novo.
      await queryClient.invalidateQueries({
        queryKey: authSessionQueryOptions.queryKey,
      });

      await navigate({
        to: '/dashboard',
        replace: true,
      });
    },
    onError: () => {
      resetField('password');
    },
  });

  const registeredNotice = hasRegistered ? 'registered' : null;

  const notice: LoginNotice | null = error
    ? getErrorNotice(error)
    : (registeredNotice ?? reason ?? null);

  // Mantém o overlay até a navegação para o dashboard terminar.
  const isSubmitting = isPending || isSuccess;

  // O erro aparece depois do envio ou ao sair de um campo preenchido: percorrer campos vazios com
  // Tab não marca tudo como inválido. Mensagens do Zod são chaves de tradução do namespace "auth".
  const getFieldError = (name: keyof LoginFormData) => {
    const message = errors[name]?.message;

    const isVisible = isSubmitted || (touchedFields[name] && Boolean(values[name]));

    return message && isVisible ? t(message as TranslationKey<'auth'>) : undefined;
  };

  const fieldErrors = {
    email: getFieldError('email'),
    password: getFieldError('password'),
  };

  // Avisos informativos (não são erros).
  const isInfoNotice = notice === 'expired' || notice === 'registered';

  // O botão só trava durante o envio: o preenchimento automático de senhas nem sempre marca o
  // formulário como alterado, então a validação fica para o submit.
  const submit = handleSubmit((credentials) => {
    if (isSubmitting) {
      return;
    }

    mutate(credentials);
  });

  // Cadastro concluído: fecha o modal, avisa e deixa o e-mail pronto para o login.
  const handleRegistered = (email: string) => {
    setIsRegisterOpen(false);

    setHasRegistered(true);

    resetLogin();

    setValue('email', email, {
      shouldValidate: true,
    });

    resetField('password');
  };

  const openRegister = () => {
    setIsRegisterOpen(true);
  };

  return {
    form,
    handleRegistered,
    isInfoNotice,
    isRegisterOpen,
    openRegister,
    setIsRegisterOpen,
    fieldErrors,
    isSubmitting,
    notice,
    submit,
  };
};
