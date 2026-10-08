import { useCanGoBack, useRouter } from '@tanstack/react-router';

export const useHistoryBack = () => {
  const router = useRouter();

  // Falso quando a página é aberta diretamente (link externo, nova aba, URL digitada).
  const canGoBack = useCanGoBack();

  const goBack = () => {
    router.history.back();
  };

  return {
    canGoBack,
    goBack,
  };
};
