import { RouteNotFound } from '@/app/router/components/route-not-found';
import { RootLayout } from '@/app/router/layouts/root-layout';
import { APP_TITLE } from '@/app/router/page-title';
import { createRootRoute } from '@tanstack/react-router';

export const Route = createRootRoute({
  head: () => ({
    meta: [{ title: APP_TITLE }],
  }),
  component: RootLayout,
  notFoundComponent: RouteNotFound,
});
