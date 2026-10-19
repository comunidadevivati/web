import { getLocalizedPageTitle } from '@/app/router/page-title';
import { CongregationsView } from '@/features/organization/presentation/views/congregations.view';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/congregacoes')({
  head: () => ({
    meta: [{ title: getLocalizedPageTitle('congregations') }],
  }),
  component: CongregationsView,
});
