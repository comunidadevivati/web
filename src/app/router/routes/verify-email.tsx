import { getLocalizedPageTitle } from '@/app/router/page-title';
import { verifyEmailSearchSchema } from '@/features/auth/presentation/models/verify-email.model';
import { VerifyEmailView } from '@/features/auth/presentation/views/verify-email.view';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/verify-email')({
  head: () => ({
    meta: [
      { title: getLocalizedPageTitle('verifyEmail') },
      { name: 'referrer', content: 'no-referrer' },
    ],
  }),
  validateSearch: verifyEmailSearchSchema,
  component: VerifyEmailView,
});
