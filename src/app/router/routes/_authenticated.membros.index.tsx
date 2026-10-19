import { getLocalizedPageTitle } from '@/app/router/page-title';
import { MembersView } from '@/features/members/presentation/views/members.view';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/membros/')({
  head: () => ({
    meta: [{ title: getLocalizedPageTitle('members') }],
  }),
  component: MembersView,
});
