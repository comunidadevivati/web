import { RouteNotFound } from '@/app/router/components/route-not-found';
import { RootLayout } from '@/app/router/layouts/root-layout';
import { createRootRoute } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: RouteNotFound,
});
