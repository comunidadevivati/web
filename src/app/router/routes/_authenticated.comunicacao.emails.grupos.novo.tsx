import { getLocalizedPageTitle } from '@/app/router/page-title';
import { EmailGroupCreateView } from '@/features/communication/presentation/views/email-group-create.view';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/comunicacao/emails/grupos/novo')({
  head: () => ({
    meta: [{ title: getLocalizedPageTitle('newEmailGroup') }],
  }),
  component: EmailGroupCreateView,
});
