import { getLocalizedPageTitle } from '@/app/router/page-title';
import { HomeView } from '@/features/home/presentation/views/home.view';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [{ title: getLocalizedPageTitle('home') }],
  }),
  component: HomeView,
});
