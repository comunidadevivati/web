import { PwaUpdatePrompt } from '@/app/pwa/pwa-update-prompt';
import { Outlet } from '@tanstack/react-router';

export const RootLayout = () => {
  return (
    <>
      <Outlet />

      <PwaUpdatePrompt />
    </>
  );
};
