import { getLocalizedPageTitle } from '@/app/router/page-title';
import { EmailGroupEditView } from '@/features/communication/presentation/views/email-group-edit.view';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/comunicacao/emails/grupos/$groupId')({
  head: () => ({
    meta: [{ title: getLocalizedPageTitle('emailGroup') }],
  }),
  component: EmailGroupEditView,
});
