import { Alert, AlertDescription, AlertTitle, Spinner } from '@/components/ui';
import { useSlowRequestsStore } from '@/shared/http/slow-requests';
import { useTranslation } from 'react-i18next';

// Aviso global (montado no main.tsx) enquanto alguma requisição ao BFF demora: no Render Free os
// serviços entram em repouso e levam até cerca de um minuto para responder no primeiro acesso.
export const ServerWakeNotice = () => {
  const { slow } = useSlowRequestsStore();

  const { t } = useTranslation();

  if (slow === 0) {
    return null;
  }

  return (
    <Alert
      aria-live="polite"
      className="fixed bottom-4 left-4 z-50 max-w-[calc(100%-2rem)] shadow-lg sm:max-w-sm"
      role="status"
    >
      <Spinner className="text-primary-strong" />

      <AlertTitle>{t('serverWake.title')}</AlertTitle>

      <AlertDescription>{t('serverWake.description')}</AlertDescription>
    </Alert>
  );
};
