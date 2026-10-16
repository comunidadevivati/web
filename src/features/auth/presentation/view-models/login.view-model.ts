import type { TranslationKey } from '@/app/i18n/translation-key';
import { authSessionQueryOptions } from '@/features/auth/application/queries/auth-session.query';
import { loginUseCase } from '@/features/auth/application/use-cases/login.use-case';
import {
  InvalidCredentialsError,
  TooManyLoginAttemptsError,
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
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

const getErrorNotice = (error: Error): LoginNotice => {
  if (error instanceof InvalidCredentialsError) {
    return 'invalidCredentials';
  }

  if (error instanceof TooManyLoginAttemptsError) {
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

  const { handleSubmit, resetField } = form;

  const { error, isPending, isSuccess, mutate } = useMutation({
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

  const notice: LoginNotice | null = error ? getErrorNotice(error) : (reason ?? null);

  // Mantém o overlay até a navegação para o dashboard terminar.
  const isSubmitting = isPending || isSuccess;

  // Mensagens do Zod são chaves de tradução do namespace "auth".
  const getFieldError = (message?: string) => {
    return message ? t(message as TranslationKey<'auth'>) : undefined;
  };

  // O botão só trava durante o envio: o preenchimento automático de senhas nem sempre marca o
  // formulário como alterado, então a validação fica para o submit.
  const submit = handleSubmit((credentials) => {
    if (isSubmitting) {
      return;
    }

    mutate(credentials);
  });

  return {
    form,
    getFieldError,
    isSubmitting,
    notice,
    submit,
  };
};
