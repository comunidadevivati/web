import { useRouteHeadRefresh } from '@/app/i18n/use-route-head-refresh';
import { PwaUpdatePrompt } from '@/app/pwa/pwa-update-prompt';
import { HeadContent, Outlet } from '@tanstack/react-router';

export const RootLayout = () => {
  useRouteHeadRefresh();

  return (
    <>
      <HeadContent />

      <Outlet />

      <PwaUpdatePrompt />
    </>
  );
};
