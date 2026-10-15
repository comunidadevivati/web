import { queryClient } from '@/app/providers/query-client';
import { RouteError } from '@/app/router/components/route-error';
import { RoutePending } from '@/app/router/components/route-pending';
import { routeTree } from '@/app/router/routeTree.gen';
import { authSessionQueryOptions } from '@/features/auth/application/queries/auth-session.query';
import { setBffUnauthorizedListener } from '@/shared/http/bff-client';
import { createRouter } from '@tanstack/react-router';

export const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultErrorComponent: RouteError,
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  defaultPendingComponent: RoutePending,
  defaultPendingMs: 150,
  defaultPendingMinMs: 300,
});

// Sessão expirada em qualquer chamada ao BFF: descarta a sessão em cache e volta ao login.
setBffUnauthorizedListener(() => {
  queryClient.setQueryData(authSessionQueryOptions.queryKey, null);

  void router.navigate({
    to: '/login',
    search: {
      reason: 'expired',
    },
    replace: true,
  });
});
