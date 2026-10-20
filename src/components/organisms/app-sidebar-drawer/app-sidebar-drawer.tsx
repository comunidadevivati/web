import livingStoneGreen from '@/assets/brand/living-stone-green.png';
import { SidebarNavItem } from '@/components/molecules';
import {
  AppSidebarNavigation,
  type AppSidebarItem,
} from '@/components/organisms/app-sidebar/app-sidebar';
import { Box, Image, Sheet, SheetContent, SheetTitle } from '@/components/ui';
import { cn } from '@/lib/utils';
import { LogOutIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Título e botão de fechar ficam no topo, sobre a superfície do header.
const titleClassName = cn(`
  text-xs font-semibold tracking-[0.18em] text-header-foreground/80 uppercase
`);

const closeClassName = cn(`
  top-5 text-header-foreground/75 hover:bg-header-accent/10 hover:text-header-accent-foreground
`);

type AppSidebarDrawerProps = {
  items: AppSidebarItem[];
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onLogout: () => void;
};

// Menu lateral do app autenticado em telas pequenas (abaixo de md): abre como drawer à esquerda e
// fecha ao navegar, ao sair, com Esc ou tocando fora.
export const AppSidebarDrawer = ({
  isOpen,
  items,
  onLogout,
  onOpenChange,
}: AppSidebarDrawerProps) => {
  const { t } = useTranslation();

  const close = () => {
    onOpenChange(false);
  };

  const logout = () => {
    close();

    onLogout();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        className="
          w-72 max-w-[85vw] gap-0 border-sidebar-border bg-sidebar text-sidebar-foreground md:hidden
        "
        closeClassName={closeClassName}
        closeLabel={t('navigation.closeMenu')}
        side="left"
      >
        {/* Topo na superfície do header, como a área do símbolo acima da sidebar no desktop. */}
        <Box
          className="
            flex h-18 shrink-0 items-center gap-3 border-b border-header-border bg-header px-4
          "
        >
          <Image
            alt=""
            aria-hidden="true"
            className="size-9 object-contain"
            src={livingStoneGreen}
          />

          <SheetTitle className={titleClassName}>{t('navigation.sidebarHeading')}</SheetTitle>
        </Box>

        <Box className="flex min-h-0 flex-1 flex-col overflow-y-auto p-3">
          <Box aria-label={t('navigation.sidebar')} className="grid gap-1" role="navigation">
            <AppSidebarNavigation isCollapsed={false} items={items} onNavigate={close} />
          </Box>
        </Box>

        <Box className="grid gap-3 border-t border-sidebar-border p-3">
          <SidebarNavItem
            icon={LogOutIcon}
            isCollapsed={false}
            label={t('navigation.logout')}
            onClick={logout}
          />
        </Box>
      </SheetContent>
    </Sheet>
  );
};
