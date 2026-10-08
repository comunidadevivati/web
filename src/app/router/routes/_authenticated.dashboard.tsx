import { getLocalizedPageTitle } from '@/app/router/page-title';
import { DashboardView } from '@/features/dashboard/presentation/views/dashboard.view';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/dashboard')({
  head: () => ({
    meta: [{ title: getLocalizedPageTitle('dashboard') }],
  }),
  component: DashboardView,
});
