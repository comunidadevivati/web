import { Alert, AlertAction, AlertDescription, AlertTitle, Button } from '@/components/ui';
import { RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useRegisterSW } from 'virtual:pwa-register/react';

export const PwaUpdatePrompt = () => {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  const { t } = useTranslation();

  if (!needRefresh) {
    return null;
  }

  return (
    <Alert className="fixed right-4 bottom-4 z-50 max-w-md shadow-lg">
      <RefreshCw />

      <AlertTitle>{t('pwa.title')}</AlertTitle>

      <AlertDescription>{t('pwa.description')}</AlertDescription>

      <AlertAction>
        <Button onClick={() => void updateServiceWorker(true)}>{t('pwa.update')}</Button>
      </AlertAction>
    </Alert>
  );
};
