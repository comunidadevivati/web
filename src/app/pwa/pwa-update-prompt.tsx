import { Alert, AlertAction, AlertDescription, AlertTitle, Button } from '@/components/ui';
import { RefreshCw } from 'lucide-react';
import { useRegisterSW } from 'virtual:pwa-register/react';

export const PwaUpdatePrompt = () => {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  if (!needRefresh) {
    return null;
  }

  return (
    <Alert className="fixed right-4 bottom-4 z-50 max-w-md shadow-lg">
      <RefreshCw />

      <AlertTitle>Nova versão disponível</AlertTitle>

      <AlertDescription>Uma nova versão da Comunidade Viva está disponível.</AlertDescription>

      <AlertAction>
        <Button onClick={() => void updateServiceWorker(true)}>Atualizar</Button>
      </AlertAction>
    </Alert>
  );
};
