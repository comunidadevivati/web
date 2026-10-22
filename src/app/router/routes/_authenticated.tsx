import { AuthenticatedLayoutView } from '@/app/layouts/authenticated/authenticated-layout.view';
import { authSessionQueryOptions } from '@/features/auth/application/queries/auth-session.query';
import { createFileRoute, redirect } from '@tanstack/react-router';

const DASHBOARD_PATH = '/dashboard';

export const Route = createFileRoute('/_authenticated')({
  // Exige sessão no BFF. Sem sessão, ou com o BFF indisponível, leva ao login (que exibe o motivo).
  // Com a sessão em cache, a navegação não espera o BFF: ela é revalidada em segundo plano. Esperar
  // aqui deixava o layout inteiro pendente e a tela era redesenhada a cada troca de página; sessão
  // expirada continua sendo tratada pelo 401 do bffClient.
  beforeLoad: async ({ context: { queryClient }, location }) => {
    const session = await queryClient
      .ensureQueryData({ ...authSessionQueryOptions, revalidateIfStale: true })
      .catch(() => null);

    if (!session) {
      throw redirect({
        to: '/login',
      });
    }

    // Conta que ainda não é de membro só acessa o Dashboard, mesmo digitando a URL de outra tela.
    if (!session.user.isMember && location.pathname !== DASHBOARD_PATH) {
      throw redirect({
        to: DASHBOARD_PATH,
        replace: true,
      });
    }
  },
  component: AuthenticatedLayoutView,
});
