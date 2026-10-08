import { useAuthenticatedLayoutViewModel } from '@/app/layouts/authenticated/authenticated-layout.view-model';
import livingStoneGreen from '@/assets/brand/living-stone-green.png';
import logoVivaWhite from '@/assets/brand/logo-viva-white.png';
import { TooltipHint } from '@/components/molecules';
import { AppSidebar, type AppSidebarItem } from '@/components/organisms';
import { Box, Button, Image, Text } from '@/components/ui';
import { Link, Outlet } from '@tanstack/react-router';
import { cn } from 'cn';
import { LayoutDashboardIcon, LogOutIcon, MenuIcon } from 'lucide-react';

const sidebarItems: AppSidebarItem[] = [
  { label: 'Dashboard', icon: LayoutDashboardIcon, to: '/dashboard' },
];

const layoutColumns = {
  collapsed: cn('md:grid-cols-[4.5rem_minmax(0,1fr)]'),
  expanded: cn('md:grid-cols-[16.5rem_minmax(0,1fr)]'),
  hidden: cn('md:grid-cols-[minmax(0,1fr)]'),
};

export const AuthenticatedLayoutView = () => {
  const { logout, sidebarMode, toggleSidebarCollapse, toggleSidebarVisibility, userEmail } =
    useAuthenticatedLayoutViewModel();

  const isCollapsed = sidebarMode === 'collapsed';

  const isHidden = sidebarMode === 'hidden';

  const sidebarVisibilityLabel = isHidden ? 'Mostrar menu lateral' : 'Ocultar menu lateral';

  return (
    <Box className="grid min-h-dvh grid-rows-[4.5rem_minmax(0,1fr)] bg-background">
      <Box
        className={cn(
          'grid border-b border-header-border bg-header shadow-elevated',
          layoutColumns[sidebarMode],
        )}
      >
        {!isHidden && (
          <Box className="flex items-center justify-center border-r border-header-border">
            <Link
              aria-label="Ir para o dashboard"
              className="
                flex items-center justify-center rounded-lg transition-all duration-200
                hover:scale-105 focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-header-accent
              "
              to="/dashboard"
            >
              <Image
                alt="Comunidade Viva"
                className={cn(
                  'object-contain transition-all duration-300',
                  isCollapsed ? 'size-9' : 'size-11',
                )}
                src={livingStoneGreen}
              />
            </Link>
          </Box>
        )}

        <Box className="relative flex min-w-0 items-center px-4 md:px-6">
          <TooltipHint label={sidebarVisibilityLabel} side="bottom">
            <Button
              aria-label={sidebarVisibilityLabel}
              className="
                shrink-0 text-header-foreground/70 hover:bg-header-accent/10
                hover:text-header-accent-foreground
              "
              size="icon"
              type="button"
              variant="ghost"
              onClick={toggleSidebarVisibility}
            >
              <MenuIcon />
            </Button>
          </TooltipHint>

          <Link
            aria-label="Ir para o dashboard"
            className="absolute left-1/2 -translate-x-1/2"
            to="/dashboard"
          >
            <Image
              alt="Comunidade Viva e Eficaz"
              className="h-10 w-auto max-w-52 object-contain"
              src={logoVivaWhite}
            />
          </Link>

          <Box className="ml-auto flex min-w-0 items-center gap-3">
            <Text
              className="
                hidden max-w-56 truncate text-sm font-medium text-header-foreground/75 lg:block
              "
            >
              {userEmail}
            </Text>

            <Text aria-hidden="true" className="hidden text-sm text-header-foreground/30 lg:block">
              |
            </Text>

            <Button
              className="
                text-header-foreground/80 hover:bg-header-accent/10
                hover:text-header-accent-foreground
              "
              type="button"
              variant="ghost"
              onClick={logout}
            >
              <LogOutIcon data-icon="inline-start" />

              <Text className="hidden text-inherit sm:block">Sair</Text>
            </Button>
          </Box>
        </Box>
      </Box>

      <Box
        className={cn(
          'grid min-h-0 transition-[grid-template-columns] duration-300 ease-out',
          layoutColumns[sidebarMode],
        )}
      >
        {!isHidden && (
          <AppSidebar
            isCollapsed={isCollapsed}
            items={sidebarItems}
            onLogout={logout}
            onToggleCollapse={toggleSidebarCollapse}
          />
        )}

        <Box className="relative min-w-0 overflow-auto">
          <Box className="relative min-h-full p-4 md:p-6 lg:p-8">
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
