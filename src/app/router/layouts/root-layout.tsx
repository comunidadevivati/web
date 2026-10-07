import { PwaUpdatePrompt } from '@/app/pwa/pwa-update-prompt';
import { HeadContent, Outlet } from '@tanstack/react-router';

export const RootLayout = () => {
  return (
    <>
      <HeadContent />

      <Outlet />

      <PwaUpdatePrompt />
    </>
  );
};
