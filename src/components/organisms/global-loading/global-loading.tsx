import { LoadingOverlay } from '@/components/ui';
import { useGlobalLoadingStore } from '@/shared/feedback/global-loading';

// Loading global da aplicação (montado no main.tsx): aparece enquanto houver operação registrada
// por globalLoading/useGlobalLoading.
export const GlobalLoading = () => {
  const { pending } = useGlobalLoadingStore();

  return pending > 0 ? <LoadingOverlay /> : null;
};
