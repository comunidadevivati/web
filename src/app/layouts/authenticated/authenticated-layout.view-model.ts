import {
  getUserDisplayName,
  getUserInitials,
  type SidebarMode,
} from '@/app/layouts/authenticated/authenticated-layout.model';
import { authSessionQueryOptions } from '@/features/auth/application/queries/auth-session.query';
import { logoutUseCase } from '@/features/auth/application/use-cases/logout.use-case';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

export const useAuthenticatedLayoutViewModel = () => {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  // A sessão já foi carregada pelo guard da rota /_authenticated.
  const { data: session } = useQuery(authSessionQueryOptions);

  const [sidebarMode, setSidebarMode] = useState<SidebarMode>('expanded');

  const [lastVisibleSidebarMode, setLastVisibleSidebarMode] =
    useState<Exclude<SidebarMode, 'hidden'>>('expanded');

  // Drawer do menu lateral em telas pequenas (abaixo de md).
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const user = session?.user ?? { subject: '' };

  const userEmail = user.email ?? '';

  const userInitials = getUserInitials(user);

  const userName = getUserDisplayName(user);

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
    isLoggingOut,
    isMobileNavOpen,
    logout,
    openMobileNav,
    setIsMobileNavOpen,
    sidebarMode,
    toggleSidebarCollapse,
    toggleSidebarVisibility,
    userEmail,
    userInitials,
    userName,
  };
};
