import { getLocalizedPageTitle } from '@/app/router/page-title';
import { confirmEmailChangeSearchSchema } from '@/features/profile/presentation/models/profile.model';
import { ConfirmEmailChangeView } from '@/features/profile/presentation/views/confirm-email-change.view';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/confirm-email-change')({
  head: () => ({
    meta: [
      { title: getLocalizedPageTitle('confirmEmailChange') },
      { name: 'referrer', content: 'no-referrer' },
    ],
  }),
  validateSearch: confirmEmailChangeSearchSchema,
  component: ConfirmEmailChangeView,
});
