import { getLocalizedPageTitle } from '@/app/router/page-title';
import { UnderConstructionView } from '@/features/under-construction/presentation/views/under-construction.view';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/eventos')({
  head: () => ({
    meta: [{ title: getLocalizedPageTitle('events') }],
  }),
  component: () => <UnderConstructionView page="events" />,
});
