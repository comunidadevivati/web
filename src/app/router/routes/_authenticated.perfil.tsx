import { getLocalizedPageTitle } from '@/app/router/page-title';
import { ProfileView } from '@/features/profile/presentation/views/profile.view';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/perfil')({
  head: () => ({
    meta: [{ title: getLocalizedPageTitle('profile') }],
  }),
  component: ProfileView,
});
