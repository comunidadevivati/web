import { useCanGoBack, useRouter } from '@tanstack/react-router';

export const useUnderConstructionViewModel = () => {
  const router = useRouter();

  // Falso quando a página é aberta diretamente (link externo, nova aba, URL digitada).
  const canGoBack = useCanGoBack();

  const handleGoBack = () => {
    router.history.back();
  };

  return {
    canGoBack,
    handleGoBack,
  };
};
