import { getLocalizedPageTitle } from '@/app/router/page-title';
import { TechnologyDashboardView } from '@/features/departments/presentation/views/technology-dashboard.view';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/departamentos/tecnologia/')({
  head: () => ({
    meta: [{ title: getLocalizedPageTitle('technology') }],
  }),
  component: TechnologyDashboardView,
});
