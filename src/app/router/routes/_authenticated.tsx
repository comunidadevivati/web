import { AuthenticatedLayoutView } from '@/app/layouts/authenticated/authenticated-layout.view';
import { getStoredAuthUser } from '@/features/auth/infrastructure/storage/auth-user.storage';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: () => {
    const user = getStoredAuthUser();

    if (!user) {
      throw redirect({
        to: '/login',
      });
    }
  },
  component: AuthenticatedLayoutView,
});
