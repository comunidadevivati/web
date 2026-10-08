import { Alert, AlertAction, AlertDescription, AlertTitle, Button } from '@/components/ui';
import { useNavigate, type ErrorComponentProps } from '@tanstack/react-router';

export const RouteError = ({ reset }: ErrorComponentProps) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    void navigate({
      to: '/dashboard',
    });
  };

  return (
    <Alert className="mx-auto mt-10 max-w-lg" variant="destructive">
      <AlertTitle>Não foi possível carregar esta página</AlertTitle>

      <AlertDescription>Ocorreu um erro inesperado. Tente novamente.</AlertDescription>

      <AlertAction className="static col-span-full mt-2 flex gap-2">
        <Button variant="outline" onClick={reset}>
          Tentar novamente
        </Button>

        <Button variant="outline" onClick={handleGoHome}>
          Voltar para o início
        </Button>
      </AlertAction>
    </Alert>
  );
};
