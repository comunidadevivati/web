import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Link } from '@tanstack/react-router';

export const RouteNotFound = () => {
  return (
    <Alert className="mx-auto mt-10 max-w-lg">
      <AlertTitle>Página não encontrada</AlertTitle>

      <AlertDescription>
        A página que você tentou acessar não existe.{' '}
        <Link className="font-medium underline underline-offset-4" to="/">
          Voltar para o início
        </Link>
      </AlertDescription>
    </Alert>
  );
};
