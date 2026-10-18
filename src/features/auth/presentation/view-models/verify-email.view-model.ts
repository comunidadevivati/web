import { authSessionQueryOptions } from '@/features/auth/application/queries/auth-session.query';
import { verifyEmailUseCase } from '@/features/auth/application/use-cases/verify-email.use-case';
import { InvalidEmailVerificationTokenError } from '@/features/auth/domain/email-verification';
import type { VerifyEmailNotice } from '@/features/auth/presentation/models/verify-email.model';
import { notify } from '@/shared/feedback/notify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const getErrorNotice = (error: Error): VerifyEmailNotice => {
  return error instanceof InvalidEmailVerificationTokenError ? 'invalidLink' : 'unavailable';
};

export const useVerifyEmailViewModel = () => {
  const { token } = useSearch({ from: '/verify-email' });

  const [verificationToken] = useState(token);

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { t } = useTranslation('auth');

  // O token é de uso único: a verificação dispara uma vez, mesmo com efeitos duplicados (StrictMode).
  const hasStarted = useRef(false);

  const { error, isError, mutate } = useMutation({
    mutationFn: (value: string) => verifyEmailUseCase(value),
    onSuccess: async ({ message }) => {
      // A sessão em cache ainda diz "não verificado": consulta o BFF de novo.
      await queryClient.invalidateQueries({ queryKey: authSessionQueryOptions.queryKey });

      // Sem sessão, o guard de /_authenticated leva ao login.
      await navigate({ to: '/dashboard', replace: true });

      notify.success({
        title: t('verifyEmail.success.title'),
        description: message ?? t('verifyEmail.success.description'),
      });
    },
  });

  useEffect(() => {
    if (token) {
      // O token sai da barra de endereço e do histórico, como na redefinição de senha.
      void navigate({ to: '/verify-email', search: {}, replace: true });
    }
  }, [navigate, token]);

  useEffect(() => {
    if (!verificationToken || hasStarted.current) {
      return;
    }

    hasStarted.current = true;

    mutate(verificationToken);
  }, [mutate, verificationToken]);

  const notice: VerifyEmailNotice | null = !verificationToken
    ? 'invalidLink'
    : isError
      ? getErrorNotice(error)
      : null;

  const goToApp = () => {
    void navigate({ to: '/dashboard', replace: true });
  };

  return {
    goToApp,
    isVerifying: notice === null,
    notice,
  };
};
