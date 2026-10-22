import { useAuthenticatedLayoutViewModel } from '@/app/layouts/authenticated/authenticated-layout.view-model';
import livingStoneGreen from '@/assets/brand/living-stone-green.png';
import logoVivaWhite from '@/assets/brand/logo-viva-white.png';
import { TooltipHint, UserMenu } from '@/components/molecules';
import {
  AppFooter,
  AppSidebar,
  AppSidebarDrawer,
  ResendVerificationDialog,
  type AppSidebarItem,
} from '@/components/organisms';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Box,
  Button,
  Image,
  LoadingOverlay,
} from '@/components/ui';
import { Link, Outlet } from '@tanstack/react-router';
import { cn } from 'cn';
import {
  Building2Icon,
  ChurchIcon,
  CircleAlertIcon,
  GlobeIcon,
  ImagesIcon,
  LayoutDashboardIcon,
  MenuIcon,
  UserCogIcon,
  UsersIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

// requiresMember: o item só aparece para contas que já são de membros.
type NavigationItem = AppSidebarItem & {
  requiresMember?: boolean;
};

const layoutColumns = {
  collapsed: cn('md:grid-cols-[4.5rem_minmax(0,1fr)]'),
  expanded: cn('md:grid-cols-[16.5rem_minmax(0,1fr)]'),
  hidden: cn('md:grid-cols-[minmax(0,1fr)]'),
};

export const AuthenticatedLayoutView = () => {
  const {
    hasLogoutError,
    isEmailVerified,
    isLoggingOut,
    isMember,
    isResendVerificationOpen,
    isResendingVerification,
    openResendVerification,
    resendVerification,
    setIsResendVerificationOpen,
    isMobileNavOpen,
    logout,
    openMobileNav,
    openProfile,
    setIsMobileNavOpen,
    sidebarMode,
    toggleSidebarCollapse,
    toggleSidebarVisibility,
    userAvatarUrl,
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

  const navigationItems: NavigationItem[] = [
    { label: t('navigation.dashboard'), icon: LayoutDashboardIcon, to: '/dashboard' },
    {
      label: t('navigation.organization'),
      icon: Building2Icon,
      to: '/organizacao',
      requiresMember: true,
    },
    {
      label: t('navigation.congregations'),
      icon: ChurchIcon,
      to: '/congregacoes',
      requiresMember: true,
    },
    {
      label: t('navigation.users'),
      icon: UserCogIcon,
      to: '/usuarios',
      requiresMember: true,
    },
    {
      label: t('navigation.members'),
      icon: UsersIcon,
      to: '/membros',
      requiresMember: true,
    },
    {
      label: t('navigation.site'),
      icon: GlobeIcon,
      children: [{ label: t('navigation.albums'), icon: ImagesIcon, to: '/site/albuns' }],
      requiresMember: true,
    },
  ];

  // Conta que ainda não é de membro (verificada ou não): somente o Dashboard.
  const sidebarItems: AppSidebarItem[] = navigationItems
    .filter(({ requiresMember }) => isMember || !requiresMember)
    .map(({ requiresMember: _requiresMember, ...item }) => item);

  return (
    <Box className="grid h-dvh grid-rows-[4.5rem_minmax(0,1fr)] bg-background">
      {isLoggingOut && <LoadingOverlay />}

      <Box
        className={cn(
          'grid border-b border-header-border bg-header shadow-elevated',
          layoutColumns[sidebarMode],
        )}
      >
        {!isHidden && (
          <Box className="hidden items-center justify-center border-r border-header-border md:flex">
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
          {/* Abaixo de md o menu lateral abre como drawer; a partir de md, mostra/oculta a sidebar. */}
          <Button
            aria-expanded={isMobileNavOpen}
            aria-haspopup="dialog"
            aria-label={t('navigation.openMenu')}
            className="
              size-11 shrink-0 text-header-foreground/70 hover:bg-header-accent/10
              hover:text-header-accent-foreground md:hidden
            "
            size="icon"
            type="button"
            variant="ghost"
            onClick={openMobileNav}
          >
            <MenuIcon />
          </Button>

          <TooltipHint label={sidebarVisibilityLabel} side="bottom">
            <Button
              aria-label={sidebarVisibilityLabel}
              className="
                hidden shrink-0 text-header-foreground/70 hover:bg-header-accent/10
                hover:text-header-accent-foreground md:inline-flex
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
              avatarUrl={userAvatarUrl}
              email={userEmail}
              emailVerified={isEmailVerified}
              greetingName={userName || userEmail}
              initials={userInitials}
              name={userName}
              onLogout={logout}
              onOpenProfile={isMember ? openProfile : undefined}
              onResendVerification={openResendVerification}
            />
          </Box>
        </Box>
      </Box>

      <ResendVerificationDialog
        email={userEmail}
        isSending={isResendingVerification}
        name={userName}
        open={isResendVerificationOpen}
        onOpenChange={setIsResendVerificationOpen}
        onSend={resendVerification}
      />

      <AppSidebarDrawer
        isOpen={isMobileNavOpen}
        items={sidebarItems}
        onLogout={logout}
        onOpenChange={setIsMobileNavOpen}
      />

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
              {hasLogoutError && (
                <Alert className="mb-4 md:mb-6" variant="destructive">
                  <CircleAlertIcon />

                  <AlertTitle>{t('session.logoutFailed.title')}</AlertTitle>

                  <AlertDescription>{t('session.logoutFailed.description')}</AlertDescription>
                </Alert>
              )}

              <Outlet />
            </Box>
          </Box>

          <AppFooter />
        </Box>
      </Box>
    </Box>
  );
};
