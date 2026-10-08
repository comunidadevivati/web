import { TooltipHint } from '@/components/molecules/tooltip-hint/tooltip-hint';
import { Button, Text } from '@/components/ui';
import { cn } from '@/lib/utils';
import { Link, type LinkProps } from '@tanstack/react-router';
import type { LucideIcon } from 'lucide-react';

const itemClassName = cn(`
  flex h-11 w-full items-center rounded-lg border border-transparent text-sm font-medium
  text-sidebar-foreground transition-all duration-200 hover:border-sidebar-border
  hover:bg-sidebar-accent hover:text-sidebar-accent-foreground
`);

const collapsedItemClassName = cn('justify-center px-0');

const expandedItemClassName = cn('justify-start gap-3 px-3');

const activeItemClassName = cn(`
  border-sidebar-primary/25 bg-sidebar-primary/10 text-sidebar-primary-foreground
  shadow-sidebar-active
`);

type SidebarNavItemBaseProps = {
  label: string;
  icon: LucideIcon;
  isCollapsed: boolean;
};

type SidebarNavItemProps = SidebarNavItemBaseProps &
  ({ to: LinkProps['to']; onClick?: never } | { onClick: () => void; to?: never });

// Item do menu lateral: navega (to) ou executa uma ação (onClick). Recolhido, mostra só o ícone
// e exibe o nome em tooltip.
export const SidebarNavItem = ({
  icon: Icon,
  isCollapsed,
  label,
  onClick,
  to,
}: SidebarNavItemProps) => {
  const className = cn(itemClassName, isCollapsed ? collapsedItemClassName : expandedItemClassName);

  const content = (
    <>
      <Icon className="size-[1.1rem] shrink-0" />

      {!isCollapsed && <Text className="text-inherit">{label}</Text>}
    </>
  );

  return (
    <TooltipHint isEnabled={isCollapsed} label={label} side="right">
      {to ? (
        <Link
          activeOptions={{ exact: true }}
          activeProps={{ className: activeItemClassName }}
          aria-label={label}
          className={className}
          to={to}
        >
          {content}
        </Link>
      ) : (
        <Button
          aria-label={label}
          className={className}
          type="button"
          variant="ghost"
          onClick={onClick}
        >
          {content}
        </Button>
      )}
    </TooltipHint>
  );
};
