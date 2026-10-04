import { RootLayout } from '@/app/router/layouts/root-layout';
import { createRootRoute } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: RootLayout,
});
