import { authSessionQueryOptions } from '@/features/auth/application/queries/auth-session.query';
import { PROFILE_QUERY_KEY } from '@/features/profile/application/queries/profile.query';
import { confirmEmailChangeUseCase } from '@/features/profile/application/use-cases/confirm-email-change.use-case';
import { getSecurityNotice } from '@/features/profile/presentation/models/profile.model';
import { notify } from '@/shared/feedback/notify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Abre o link enviado ao novo e-mail. Público: o link pode ser aberto em outro aparelho, sem sessão.
export const useConfirmEmailChangeViewModel = () => {
  const { token } = useSearch({ from: '/confirm-email-change' });

  const [confirmationToken] = useState(token);

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { t } = useTranslation('profile');

  // O token é de uso único: a confirmação dispara uma vez, mesmo com efeitos duplicados (StrictMode).
  const hasStarted = useRef(false);

  const { error, isError, mutate } = useMutation({
    mutationFn: (value: string) => confirmEmailChangeUseCase(value),
    onSuccess: async ({ message }) => {
      // Sessão e Perfil em cache ainda mostram o e-mail anterior.
      await queryClient.invalidateQueries({ queryKey: authSessionQueryOptions.queryKey });

      await queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });

      // Sem sessão, o guard de /_authenticated leva ao login.
      await navigate({ to: '/perfil', replace: true });

      notify.success({
        title: t('confirmEmailChange.success.title'),
        description: message ?? t('confirmEmailChange.success.description'),
      });
    },
  });

  useEffect(() => {
    if (token) {
      // O token sai da barra de endereço e do histórico.
      void navigate({ to: '/confirm-email-change', search: {}, replace: true });
    }
  }, [navigate, token]);

  useEffect(() => {
    if (!confirmationToken || hasStarted.current) {
      return;
    }

    hasStarted.current = true;

    mutate(confirmationToken);
  }, [confirmationToken, mutate]);

  const notice = !confirmationToken ? 'invalidLink' : isError ? getSecurityNotice(error) : null;

  // A falha é retorno de request (ou link sem token): aparece em toast.
  useEffect(() => {
    if (notice) {
      notify.error({
        title: t(`securityNotices.${notice}.title`),
        description: t(`securityNotices.${notice}.description`),
      });
    }
  }, [notice, t]);

  const goToApp = () => {
    void navigate({ to: '/perfil', replace: true });
  };

  return {
    goToApp,
    isConfirming: notice === null,
    notice,
  };
};
