import { useAuthenticatedLayoutViewModel } from '@/app/layouts/authenticated/authenticated-layout.view-model';
import livingStoneGreen from '@/assets/brand/living-stone-green.png';
import logoVivaWhite from '@/assets/brand/logo-viva-white.png';
import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { Text } from '@/components/ui/text';
import { Link, Outlet } from '@tanstack/react-router';
import { cn } from 'cn';
import {
  LayoutDashboardIcon,
  LogOutIcon,
  MenuIcon,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
} from 'lucide-react';

const layoutColumns = {
  collapsed: 'md:grid-cols-[4.5rem_minmax(0,1fr)]',
  expanded: 'md:grid-cols-[16.5rem_minmax(0,1fr)]',
  hidden: 'md:grid-cols-[minmax(0,1fr)]',
};

export const AuthenticatedLayoutView = () => {
  const { logout, sidebarMode, toggleSidebarCollapse, toggleSidebarVisibility, userEmail } =
    useAuthenticatedLayoutViewModel();

  const isCollapsed = sidebarMode === 'collapsed';

  const isHidden = sidebarMode === 'hidden';

  return (
    <Box className="grid min-h-dvh grid-rows-[4.5rem_minmax(0,1fr)] bg-[#afc6cb]">
      <Box
        className={cn(
          'grid border-b border-[#1d3a41] bg-[#081519] shadow-[0_8px_30px_rgba(0,0,0,0.20)]',
          layoutColumns[sidebarMode],
        )}
      >
        {!isHidden && (
          <Box className="flex items-center justify-center border-r border-[#163036]">
            <Link
              aria-label="Ir para a página inicial"
              className="flex items-center justify-center rounded-lg transition-all duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16b3bb]"
              to="/"
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
          <Button
            aria-label={isHidden ? 'Mostrar menu lateral' : 'Ocultar menu lateral'}
            className="shrink-0 text-white/70 hover:bg-[#16b3bb]/10 hover:text-[#65e3e8]"
            size="icon"
            title={isHidden ? 'Mostrar menu lateral' : 'Ocultar menu lateral'}
            type="button"
            variant="ghost"
            onClick={toggleSidebarVisibility}
          >
            <MenuIcon />
          </Button>

          <Link
            aria-label="Ir para a página inicial"
            className="absolute left-1/2 -translate-x-1/2"
            to="/"
          >
            <Image
              alt="Comunidade Viva e Eficaz"
              className="h-10 w-auto max-w-52 object-contain"
              src={logoVivaWhite}
            />
          </Link>

          <Box className="ml-auto flex min-w-0 items-center gap-3">
            <Text className="hidden max-w-56 truncate text-sm font-medium text-white/75 lg:block">
              {userEmail}
            </Text>

            <Text aria-hidden="true" className="hidden text-sm text-[#2f5a61] lg:block">
              |
            </Text>

            <Button
              className="text-white/80 hover:bg-[#16b3bb]/10 hover:text-[#65e3e8]"
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
          <Box className="hidden min-h-0 flex-col border-r border-[#1d3a41] bg-[#10272d] md:flex">
            <Box className="flex min-h-0 flex-1 flex-col p-3">
              <Box
                className={cn(
                  'mb-3 flex h-10 items-center',
                  isCollapsed ? 'justify-center' : 'justify-between px-2',
                )}
              >
                {!isCollapsed && (
                  <Text className="text-[0.65rem] font-semibold tracking-[0.18em] text-[#588088] uppercase">
                    Navegação
                  </Text>
                )}

                <Button
                  aria-label={isCollapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
                  className="text-[#6f9299] hover:bg-[#11262c] hover:text-[#65e3e8]"
                  size="icon-sm"
                  title={isCollapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
                  type="button"
                  variant="ghost"
                  onClick={toggleSidebarCollapse}
                >
                  {isCollapsed ? <PanelLeftOpenIcon /> : <PanelLeftCloseIcon />}
                </Button>
              </Box>

              <Link
                activeOptions={{
                  exact: true,
                }}
                activeProps={{
                  className:
                    'border-[#16b3bb]/25 bg-[#16b3bb]/10 text-[#65e3e8] shadow-[inset_3px_0_0_#16b3bb]',
                }}
                aria-label="Dashboard"
                className={cn(
                  'flex h-11 items-center rounded-lg border border-transparent text-sm font-medium text-[#91a8ad] transition-all duration-200 hover:border-[#1f4147] hover:bg-[#11262c] hover:text-white',
                  isCollapsed ? 'justify-center px-0' : 'gap-3 px-3',
                )}
                title={isCollapsed ? 'Dashboard' : undefined}
                to="/"
              >
                <LayoutDashboardIcon className="size-[1.1rem] shrink-0" />

                {!isCollapsed && <Text className="text-inherit">Dashboard</Text>}
              </Link>
            </Box>

            <Box className="border-t border-[#163036] p-3">
              <Button
                aria-label="Sair"
                className={cn(
                  'h-11 w-full text-[#91a8ad] hover:bg-[#11262c] hover:text-[#65e3e8]',
                  isCollapsed ? 'justify-center px-0' : 'justify-start gap-3',
                )}
                title={isCollapsed ? 'Sair' : undefined}
                type="button"
                variant="ghost"
                onClick={logout}
              >
                <LogOutIcon className="shrink-0" />

                {!isCollapsed && <Text className="text-inherit">Sair</Text>}
              </Button>
            </Box>
          </Box>
        )}

        <Box className="relative min-w-0 overflow-auto">
          <Box className="pointer-events-none absolute inset-0 bg-linear-to-br from-[#c5d7da] via-[#bcd1d5] to-[#afc6cb]" />

          <Box className="relative min-h-full p-4 md:p-6 lg:p-8">
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
