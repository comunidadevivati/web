import { useHistoryBack } from '@/shared/navigation/use-history-back';

export const useUnderConstructionViewModel = () => {
  const { canGoBack, goBack } = useHistoryBack();

  return {
    canGoBack,
    handleGoBack: goBack,
  };
};
