import type { router } from '@/app/router/router';

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export {};
