import { authSessionQueryOptions } from '@/features/auth/application/queries/auth-session.query';
import { startLoginUseCase } from '@/features/auth/application/use-cases/start-login.use-case';
import type { LoginNotice } from '@/features/auth/presentation/models/login.model';
import { useQuery } from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

export const useLoginViewModel = () => {
  const { reason } = useSearch({ from: '/login' });

  // Mesma consulta do guard da rota: em erro, o BFF não respondeu ao verificar a sessão.
  const { isError, isFetching, refetch } = useQuery(authSessionQueryOptions);

  const [isRedirecting, setIsRedirecting] = useState(false);

  // Ao voltar do Keycloak pelo botão "voltar", o navegador pode restaurar a página do cache
  // (bfcache) ainda com o overlay de carregamento: libera o botão novamente.
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        setIsRedirecting(false);
      }
    };

    window.addEventListener('pageshow', handlePageShow);

    return () => {
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);

  const notice: LoginNotice | null = isError ? 'unavailable' : (reason ?? null);

  // Sem resposta do BFF o login também falharia: o botão volta quando a nova tentativa funcionar.
  const isLoginDisabled = isRedirecting || isFetching || isError;

  // Sai da SPA para o fluxo OIDC do BFF (Keycloak). Credenciais nunca passam pelo front.
  const login = () => {
    if (isLoginDisabled) {
      return;
    }

    setIsRedirecting(true);

    startLoginUseCase();
  };

  const retry = () => {
    void refetch();
  };

  return {
    isLoginDisabled,
    isRedirecting,
    isRetrying: isFetching,
    login,
    notice,
    retry,
  };
};
