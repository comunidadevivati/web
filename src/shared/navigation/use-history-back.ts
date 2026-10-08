import { useCanGoBack, useRouter } from '@tanstack/react-router';

export const useHistoryBack = () => {
  const { history } = useRouter();

  const canGoBackInApp = useCanGoBack();

  // Também volta para quem chegou de fora (busca, rede social, link digitado na mesma aba).
  // Só é falso quando não há página anterior, como em uma aba nova aberta direto no link.
  const canGoBack = canGoBackInApp || window.history.length > 1;

  const goBack = () => {
    history.back();
  };

  return {
    canGoBack,
    goBack,
  };
};
