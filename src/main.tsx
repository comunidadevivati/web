import { LocaleProvider } from '@/app/providers/locale-provider';
import { QueryProvider } from '@/app/providers/query-provider';
import { ThemeProvider } from '@/app/providers/theme-provider';
import { router } from '@/app/router/router';
import { GlobalLoading, Toaster } from '@/components/organisms';
import { TooltipProvider } from '@/components/ui';
import '@/index.css';
import { RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <LocaleProvider>
        <QueryProvider>
          <TooltipProvider>
            <Toaster>
              <RouterProvider router={router} />

              <GlobalLoading />
            </Toaster>
          </TooltipProvider>
        </QueryProvider>
      </LocaleProvider>
    </ThemeProvider>
  </StrictMode>,
);
