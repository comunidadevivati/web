import { getLocalizedPageTitle } from '@/app/router/page-title';
import { EmailGroupsView } from '@/features/communication/presentation/views/email-groups.view';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/comunicacao/emails/grupos/')({
  head: () => ({
    meta: [{ title: getLocalizedPageTitle('emailGroups') }],
  }),
  component: EmailGroupsView,
});
