import { SidebarNavItem, ThemeToggle, TooltipHint } from '@/components/molecules';
import { Box, Button, Text } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { LinkProps } from '@tanstack/react-router';
import { LogOutIcon, PanelLeftCloseIcon, PanelLeftOpenIcon, type LucideIcon } from 'lucide-react';

export type AppSidebarItem = {
  label: string;
  icon: LucideIcon;
  to: LinkProps['to'];
};

type AppSidebarProps = {
  items: AppSidebarItem[];
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onLogout: () => void;
};

// Menu lateral do app autenticado: navegação, recolher/expandir, tema e saída.
export const AppSidebar = ({ isCollapsed, items, onLogout, onToggleCollapse }: AppSidebarProps) => {
  const collapseLabel = isCollapsed ? 'Expandir menu lateral' : 'Recolher menu lateral';

  return (
    <Box className="hidden min-h-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
      <Box className="flex min-h-0 flex-1 flex-col p-3">
        <Box
          className={cn(
            'mb-3 flex h-10 items-center',
            isCollapsed ? 'justify-center' : 'justify-between px-2',
          )}
        >
          {!isCollapsed && (
            <Text
              className="
                text-[0.65rem] font-semibold tracking-[0.18em] text-sidebar-muted-foreground/80
                uppercase
              "
            >
              Navegação
            </Text>
          )}

          <TooltipHint label={collapseLabel} side="right">
            <Button
              aria-label={collapseLabel}
              className="
                text-sidebar-muted-foreground hover:bg-sidebar-accent
                hover:text-sidebar-primary-foreground
              "
              size="icon-sm"
              type="button"
              variant="ghost"
              onClick={onToggleCollapse}
            >
              {isCollapsed ? <PanelLeftOpenIcon /> : <PanelLeftCloseIcon />}
            </Button>
          </TooltipHint>
        </Box>

        <Box aria-label="Menu lateral" className="grid gap-1" role="navigation">
          {items.map((item) => (
            <SidebarNavItem
              key={item.label}
              icon={item.icon}
              isCollapsed={isCollapsed}
              label={item.label}
              to={item.to}
            />
          ))}
        </Box>
      </Box>

      <Box className="grid gap-3 border-t border-sidebar-border p-3">
        <ThemeToggle
          className={isCollapsed ? 'justify-self-center' : 'justify-between'}
          orientation={isCollapsed ? 'vertical' : 'horizontal'}
          tone="sidebar"
        />

        <SidebarNavItem
          icon={LogOutIcon}
          isCollapsed={isCollapsed}
          label="Sair"
          onClick={onLogout}
        />
      </Box>
    </Box>
  );
};
