import { getLocalizedPageTitle } from '@/app/router/page-title';
import { ContactView } from '@/features/contact/presentation/views/contact.view';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/contato')({
  head: () => ({
    meta: [{ title: getLocalizedPageTitle('contact') }],
  }),
  component: ContactView,
});
