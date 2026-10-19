import { getLocalizedPageTitle } from '@/app/router/page-title';
import { UsersView } from '@/features/users/presentation/views/users.view';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/usuarios')({
  head: () => ({
    meta: [{ title: getLocalizedPageTitle('users') }],
  }),
  component: UsersView,
});
