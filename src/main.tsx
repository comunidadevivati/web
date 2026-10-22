import { LocaleProvider } from '@/app/providers/locale-provider';
import { QueryProvider } from '@/app/providers/query-provider';
import { ThemeProvider } from '@/app/providers/theme-provider';
import { router } from '@/app/router/router';
import { GlobalLoading, ServerWakeNotice, Toaster } from '@/components/organisms';
import { TooltipProvider } from '@/components/ui';
import '@/index.css';
import { keepServersAwake } from '@/shared/http/wake-servers';
import { RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

keepServersAwake();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <LocaleProvider>
        <QueryProvider>
          <TooltipProvider>
            <Toaster>
              <RouterProvider router={router} />

              <GlobalLoading />

              <ServerWakeNotice />
            </Toaster>
          </TooltipProvider>
        </QueryProvider>
      </LocaleProvider>
    </ThemeProvider>
  </StrictMode>,
);
