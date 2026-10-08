import { useAuthenticatedLayoutViewModel } from '@/app/layouts/authenticated/authenticated-layout.view-model';
import livingStoneGreen from '@/assets/brand/living-stone-green.png';
import logoVivaWhite from '@/assets/brand/logo-viva-white.png';
import { TooltipHint, UserMenu } from '@/components/molecules';
import { AppFooter, AppSidebar, type AppSidebarItem } from '@/components/organisms';
import { Box, Button, Image } from '@/components/ui';
import { Link, Outlet } from '@tanstack/react-router';
import { cn } from 'cn';
import { LayoutDashboardIcon, MenuIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const layoutColumns = {
  collapsed: cn('md:grid-cols-[4.5rem_minmax(0,1fr)]'),
  expanded: cn('md:grid-cols-[16.5rem_minmax(0,1fr)]'),
  hidden: cn('md:grid-cols-[minmax(0,1fr)]'),
};

export const AuthenticatedLayoutView = () => {
  const {
    logout,
    sidebarMode,
    toggleSidebarCollapse,
    toggleSidebarVisibility,
    userEmail,
    userInitials,
    userName,
  } = useAuthenticatedLayoutViewModel();

  const isCollapsed = sidebarMode === 'collapsed';

  const isHidden = sidebarMode === 'hidden';

  const { t } = useTranslation();

  const sidebarVisibilityLabel = isHidden
    ? t('navigation.showSidebar')
    : t('navigation.hideSidebar');

  const sidebarItems: AppSidebarItem[] = [
    { label: t('navigation.dashboard'), icon: LayoutDashboardIcon, to: '/dashboard' },
  ];

  return (
    <Box className="grid h-dvh grid-rows-[4.5rem_minmax(0,1fr)] bg-background">
      <Box
        className={cn(
          'grid border-b border-header-border bg-header shadow-elevated',
          layoutColumns[sidebarMode],
        )}
      >
        {!isHidden && (
          <Box className="flex items-center justify-center border-r border-header-border">
            <Link
              aria-label={t('navigation.goToDashboard')}
              className="
                flex items-center justify-center rounded-lg transition-all duration-200
                hover:scale-105 focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-header-accent
              "
              to="/dashboard"
            >
              <Image
                alt={t('app.name')}
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
            aria-label={t('navigation.goToDashboard')}
            className="absolute left-1/2 -translate-x-1/2"
            to="/dashboard"
          >
            <Image
              alt={t('app.fullName')}
              className="h-10 w-auto max-w-52 object-contain"
              src={logoVivaWhite}
            />
          </Link>

          <Box className="ml-auto flex items-center">
            <UserMenu
              email={userEmail}
              greetingName={userEmail}
              initials={userInitials}
              name={userName}
              onLogout={logout}
            />
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

        {/* O rodapé ocupa só a coluna do conteúdo: acompanha a sidebar expandida, recolhida ou oculta. */}
        <Box className="flex min-h-0 min-w-0 flex-col">
          <Box className="relative min-h-0 flex-1 overflow-auto">
            <Box className="relative min-h-full p-4 md:p-6 lg:p-8">
              <Outlet />
            </Box>
          </Box>

          <AppFooter />
        </Box>
      </Box>
    </Box>
  );
};
