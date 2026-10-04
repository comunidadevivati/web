import { RouteError } from '@/app/router/components/route-error';
import { RoutePending } from '@/app/router/components/route-pending';
import { routeTree } from '@/app/router/routeTree.gen';
import { createRouter } from '@tanstack/react-router';

export const router = createRouter({
  routeTree,
  defaultErrorComponent: RouteError,
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  defaultPendingComponent: RoutePending,
  defaultPendingMs: 150,
  defaultPendingMinMs: 300,
});
