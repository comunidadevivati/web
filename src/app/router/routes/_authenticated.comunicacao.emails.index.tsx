import { getLocalizedPageTitle } from '@/app/router/page-title';
import { EmailsDashboardView } from '@/features/communication/presentation/views/emails-dashboard.view';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/comunicacao/emails/')({
  head: () => ({
    meta: [{ title: getLocalizedPageTitle('emails') }],
  }),
  component: EmailsDashboardView,
});
