import { AuthenticatedLayoutView } from '@/app/layouts/authenticated/authenticated-layout.view';
import { authSessionQueryOptions } from '@/features/auth/application/queries/auth-session.query';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated')({
  // Exige sessão no BFF. Sem sessão, ou com o BFF indisponível, leva ao login (que exibe o motivo).
  beforeLoad: async ({ context: { queryClient } }) => {
    const session = await queryClient.fetchQuery(authSessionQueryOptions).catch(() => null);

    if (!session) {
      throw redirect({
        to: '/login',
      });
    }
  },
  component: AuthenticatedLayoutView,
});
