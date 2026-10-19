import { getLocalizedPageTitle } from '@/app/router/page-title';
import { OrganizationView } from '@/features/organization/presentation/views/organization.view';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/organizacao')({
  head: () => ({
    meta: [{ title: getLocalizedPageTitle('organization') }],
  }),
  component: OrganizationView,
});
