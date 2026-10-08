import { useRouter } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Os títulos das páginas vêm do head das rotas; ao trocar o idioma, reavalia as rotas para atualizá-los.
export const useRouteHeadRefresh = () => {
  const { i18n } = useTranslation();

  // Sem desestruturar: invalidate é método da instância do router e depende do this.
  const router = useRouter();

  useEffect(() => {
    const refresh = () => {
      void router.invalidate();
    };

    i18n.on('languageChanged', refresh);

    return () => {
      i18n.off('languageChanged', refresh);
    };
  }, [i18n, router]);
};
