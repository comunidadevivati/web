import { getLocalizedPageTitle } from '@/app/router/page-title';
import { resetPasswordSearchSchema } from '@/features/auth/presentation/models/reset-password.model';
import { ResetPasswordView } from '@/features/auth/presentation/views/reset-password.view';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/reset-password')({
  head: () => ({
    meta: [
      { title: getLocalizedPageTitle('resetPassword') },
      { name: 'referrer', content: 'no-referrer' },
    ],
  }),
  validateSearch: resetPasswordSearchSchema,
  component: ResetPasswordView,
});
