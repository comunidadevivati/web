import { getLocalizedPageTitle } from '@/app/router/page-title';
import { authSessionQueryOptions } from '@/features/auth/application/queries/auth-session.query';
import { loginSearchSchema } from '@/features/auth/presentation/models/login.model';
import { LoginView } from '@/features/auth/presentation/views/login.view';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/login')({
  head: () => ({
    meta: [{ title: getLocalizedPageTitle('login') }],
  }),
  validateSearch: loginSearchSchema,
  // Com sessão ativa, vai direto ao dashboard. Sem sessão (ou com o BFF indisponível), mostra o login.
  beforeLoad: async ({ context: { queryClient } }) => {
    const session = await queryClient.fetchQuery(authSessionQueryOptions).catch(() => null);

    if (session) {
      throw redirect({
        to: '/dashboard',
      });
    }
  },
  component: LoginView,
});
