import { getLocalizedPageTitle } from '@/app/router/page-title';
import { LeadershipDashboardView } from '@/features/departments/presentation/views/leadership-dashboard.view';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/departamentos/lideranca/')({
  head: () => ({
    meta: [{ title: getLocalizedPageTitle('leadership') }],
  }),
  component: LeadershipDashboardView,
});
