import { getLocalizedPageTitle } from '@/app/router/page-title';
import { getStoredAuthUser } from '@/features/auth/infrastructure/storage/auth-user.storage';
import { LoginView } from '@/features/auth/presentation/views/login.view';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/login')({
  head: () => ({
    meta: [{ title: getLocalizedPageTitle('login') }],
  }),
  beforeLoad: () => {
    const user = getStoredAuthUser();

    if (user) {
      throw redirect({
        to: '/dashboard',
      });
    }
  },
  component: LoginView,
});
