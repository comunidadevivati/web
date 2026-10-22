import {
  getUserDisplayName,
  getUserInitials,
  type SidebarMode,
} from '@/app/layouts/authenticated/authenticated-layout.model';
import { authSessionQueryOptions } from '@/features/auth/application/queries/auth-session.query';
import { logoutUseCase } from '@/features/auth/application/use-cases/logout.use-case';
import { resendEmailVerificationUseCase } from '@/features/auth/application/use-cases/resend-email-verification.use-case';
import { TooManyAttemptsError } from '@/features/auth/domain/auth-session';
import { EmailAlreadyVerifiedError } from '@/features/auth/domain/email-verification';
import { profileQueryOptions } from '@/features/profile/application/queries/profile.query';
import { notify } from '@/shared/feedback/notify';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const getResendErrorKey = (error: Error) => {
  if (error instanceof EmailAlreadyVerifiedError) {
    return 'alreadyVerified';
  }

  if (error instanceof TooManyAttemptsError) {
    return 'tooManyAttempts';
  }

  return 'unavailable';
};

export const useAuthenticatedLayoutViewModel = () => {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { t } = useTranslation();

  // A sessão já foi carregada pelo guard da rota /_authenticated.
  const { data: session } = useQuery(authSessionQueryOptions);

  const [sidebarMode, setSidebarMode] = useState<SidebarMode>('expanded');

  const [lastVisibleSidebarMode, setLastVisibleSidebarMode] =
    useState<Exclude<SidebarMode, 'hidden'>>('expanded');

  // Drawer do menu lateral em telas pequenas (abaixo de md).
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const user = session?.user ?? { subject: '', emailVerified: false, isMember: false };

  const userEmail = user.email ?? '';

  const userInitials = getUserInitials(user);

  const userName = getUserDisplayName(user);

  const isEmailVerified = user.emailVerified;

  const { isMember } = user;

  // Foto do cabeçalho: só membros têm Perfil (e foto).
  const { data: profile } = useQuery({ ...profileQueryOptions, enabled: isMember });

  const userAvatarUrl = isMember ? (profile?.avatarUrl ?? null) : null;

  const openProfile = () => {
    void navigate({ to: '/perfil' });
  };

  // Confirmação antes de reenviar o link de verificação do e-mail.
  const [isResendVerificationOpen, setIsResendVerificationOpen] = useState(false);

  const { isPending: isResendingVerification, mutate: mutateResendVerification } = useMutation({
    mutationFn: (csrfToken: string) => resendEmailVerificationUseCase(csrfToken),
    onSuccess: ({ message }) => {
      setIsResendVerificationOpen(false);

      notify.success({
        title: t('emailVerification.resendSuccess.title'),
        description: message ?? t('emailVerification.resendSuccess.description'),
      });
    },
    onError: async (error) => {
      const errorKey = getResendErrorKey(error);

      notify.error({
        title: t(`emailVerification.resendErrors.${errorKey}.title`),
        description: t(`emailVerification.resendErrors.${errorKey}.description`),
      });

      // Já verificado em outra aba ou aparelho: atualiza a sessão para remover o aviso.
      if (error instanceof EmailAlreadyVerifiedError) {
        setIsResendVerificationOpen(false);

        await queryClient.invalidateQueries({ queryKey: authSessionQueryOptions.queryKey });
      }
    },
  });

  const openResendVerification = () => {
    setIsResendVerificationOpen(true);
  };

  const resendVerification = () => {
    if (session && !isResendingVerification) {
      mutateResendVerification(session.csrfToken);
    }
  };

  // Encerra a sessão local só depois que o BFF confirmar: se a chamada falhar, a sessão continua
  // ativa no servidor e o usuário é avisado, em vez de parecer deslogado.
  const endLocalSession = async () => {
    queryClient.setQueryData(authSessionQueryOptions.queryKey, null);

    await navigate({
      to: '/login',
      replace: true,
    });

    // Remove do cache qualquer dado do usuário que saiu.
    queryClient.removeQueries({
      predicate: ({ queryKey }) => queryKey[0] !== authSessionQueryOptions.queryKey[0],
    });
  };

  const {
    isError: hasLogoutError,
    isPending: isLoggingOut,
    mutate,
  } = useMutation({
    mutationFn: (csrfToken: string) => logoutUseCase(csrfToken),
    onSuccess: endLocalSession,
  });

  const toggleSidebarVisibility = () => {
    if (sidebarMode === 'hidden') {
      setSidebarMode(lastVisibleSidebarMode);

      return;
    }

    setLastVisibleSidebarMode(sidebarMode);

    setSidebarMode('hidden');
  };

  const toggleSidebarCollapse = () => {
    const nextMode = sidebarMode === 'expanded' ? 'collapsed' : 'expanded';

    setSidebarMode(nextMode);

    setLastVisibleSidebarMode(nextMode);
  };

  const openMobileNav = () => {
    setIsMobileNavOpen(true);
  };

  const logout = () => {
    if (isLoggingOut) {
      return;
    }

    if (!session) {
      void endLocalSession();

      return;
    }

    mutate(session.csrfToken);
  };

  return {
    hasLogoutError,
    isEmailVerified,
    isMember,
    isResendVerificationOpen,
    isResendingVerification,
    openResendVerification,
    resendVerification,
    setIsResendVerificationOpen,
    isLoggingOut,
    isMobileNavOpen,
    logout,
    openMobileNav,
    openProfile,
    setIsMobileNavOpen,
    sidebarMode,
    toggleSidebarCollapse,
    toggleSidebarVisibility,
    userAvatarUrl,
    userEmail,
    userInitials,
    userName,
  };
};
