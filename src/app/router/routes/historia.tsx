import { getPageTitle } from '@/app/router/page-title';
import { UnderConstructionView } from '@/features/under-construction/presentation/views/under-construction.view';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/historia')({
  head: () => ({
    meta: [{ title: getPageTitle('História') }],
  }),
  component: () => <UnderConstructionView pageName="História" />,
});
