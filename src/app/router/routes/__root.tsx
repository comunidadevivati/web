import { RouteNotFound } from '@/app/router/components/route-not-found';
import { RootLayout } from '@/app/router/layouts/root-layout';
import { APP_TITLE } from '@/app/router/page-title';
import type { RouterContext } from '@/app/router/router-context';
import { createRootRouteWithContext } from '@tanstack/react-router';

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [{ title: APP_TITLE }],
  }),
  component: RootLayout,
  notFoundComponent: RouteNotFound,
});
