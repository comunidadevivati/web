import { SidebarNavItem } from '@/components/molecules/sidebar-nav-item/sidebar-nav-item';
import { Box, Button, Separator, Text } from '@/components/ui';
import { cn } from '@/lib/utils';
import { useMatchRoute, type LinkProps } from '@tanstack/react-router';
import { ChevronDownIcon, type LucideIcon } from 'lucide-react';
import { useId, useState } from 'react';

const groupButtonClassName = cn(`
  flex h-11 w-full items-center justify-start gap-3 rounded-lg border border-transparent px-3
  text-sm font-medium text-sidebar-foreground transition-all duration-200
  hover:border-sidebar-border hover:bg-sidebar-accent hover:text-sidebar-accent-foreground
`);

export type SidebarNavLink = {
  label: string;
  icon: LucideIcon;
  to: LinkProps['to'];
};

type SidebarNavGroupProps = {
  label: string;
  icon: LucideIcon;
  items: SidebarNavLink[];
  isCollapsed: boolean;
  onNavigate?: () => void;
};

// Grupo do menu lateral (ex.: Site → Álbuns). Expandido, abre e fecha os itens abaixo do título e já
// nasce aberto quando a rota atual pertence ao grupo. Recolhido, mostra os ícones dos itens separados
// por uma linha, com o nome em tooltip.
export const SidebarNavGroup = ({
  icon: Icon,
  isCollapsed,
  items,
  label,
  onNavigate,
}: SidebarNavGroupProps) => {
  const matchRoute = useMatchRoute();

  const listId = useId();

  const hasActiveItem = items.some(({ to }) => Boolean(matchRoute({ to, fuzzy: true })));

  const [isOpen, setIsOpen] = useState(hasActiveItem);

  const links = items.map((item) => (
    <SidebarNavItem
      key={item.label}
      icon={item.icon}
      isCollapsed={isCollapsed}
      label={item.label}
      to={item.to}
      onClick={onNavigate}
    />
  ));

  if (isCollapsed) {
    return (
      <Box aria-label={label} className="grid gap-1" role="group">
        <Separator className="my-1 bg-sidebar-border" />

        {links}
      </Box>
    );
  }

  return (
    <Box className="grid gap-1">
      <Button
        aria-controls={listId}
        aria-expanded={isOpen}
        className={groupButtonClassName}
        type="button"
        variant="ghost"
        onClick={() => {
          setIsOpen((current) => !current);
        }}
      >
        <Icon className="size-[1.1rem] shrink-0" />

        <Text className="flex-1 text-left text-inherit">{label}</Text>

        <ChevronDownIcon
          aria-hidden="true"
          className={cn(
            'size-4 shrink-0 transition-transform duration-200',
            isOpen && 'rotate-180',
          )}
        />
      </Button>

      {isOpen && (
        <Box
          aria-label={label}
          className="ml-5 grid gap-1 border-l border-sidebar-border pl-2"
          id={listId}
          role="group"
        >
          {links}
        </Box>
      )}
    </Box>
  );
};
