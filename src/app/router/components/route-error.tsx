import { Alert, AlertAction, AlertDescription, AlertTitle, Button } from '@/components/ui';
import { useNavigate, type ErrorComponentProps } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

export const RouteError = ({ reset }: ErrorComponentProps) => {
  const navigate = useNavigate();

  const { t } = useTranslation();

  const handleGoHome = () => {
    void navigate({
      to: '/dashboard',
    });
  };

  return (
    <Alert className="mx-auto mt-10 max-w-lg" variant="destructive">
      <AlertTitle>{t('routeError.title')}</AlertTitle>

      <AlertDescription>{t('routeError.description')}</AlertDescription>

      <AlertAction className="static col-span-full mt-2 flex gap-2">
        <Button variant="outline" onClick={reset}>
          {t('routeError.retry')}
        </Button>

        <Button variant="outline" onClick={handleGoHome}>
          {t('routeError.goHome')}
        </Button>
      </AlertAction>
    </Alert>
  );
};
