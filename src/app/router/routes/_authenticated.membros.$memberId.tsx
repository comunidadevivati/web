import { getLocalizedPageTitle } from '@/app/router/page-title';
import { MemberDetailView } from '@/features/members/presentation/views/member-detail.view';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/membros/$memberId')({
  head: () => ({
    meta: [{ title: getLocalizedPageTitle('member') }],
  }),
  component: MemberDetailView,
});
