import type { ThemePreference } from '@/app/theme/theme.model';
import { useThemeStore } from '@/app/theme/theme.store';
import { TooltipHint } from '@/components/molecules/tooltip-hint/tooltip-hint';
import { Box, Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import { MonitorIcon, MoonIcon, SunIcon, type LucideIcon } from 'lucide-react';

type ThemeOption = {
  value: ThemePreference;
  label: string;
  icon: LucideIcon;
};

const themeOptions: ThemeOption[] = [
  { value: 'system', label: 'Tema do sistema', icon: MonitorIcon },
  { value: 'light', label: 'Tema claro', icon: SunIcon },
  { value: 'dark', label: 'Tema escuro', icon: MoonIcon },
];

const themeToggleVariants = cva('inline-flex gap-1 rounded-xl border p-1', {
  variants: {
    tone: {
      header: 'border-header-border bg-header-foreground/5',
      sidebar: 'border-sidebar-border bg-sidebar-accent/40',
    },
    orientation: {
      horizontal: 'flex-row',
      vertical: 'flex-col',
    },
  },
});

const themeOptionVariants = cva('size-10 rounded-lg [&_svg:not([class*="size-"])]:size-[1.1rem]', {
  variants: {
    tone: {
      header: `
        text-header-foreground/70 hover:bg-header-accent/10 hover:text-header-accent-foreground
        focus-visible:ring-header-accent aria-pressed:bg-header-accent/15
        aria-pressed:text-header-accent-foreground
      `,
      sidebar: `
        text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground
        aria-pressed:bg-sidebar-primary/15 aria-pressed:text-sidebar-primary-foreground
      `,
    },
  },
});

type ThemeToggleProps = {
  tone: 'header' | 'sidebar';
  orientation?: 'horizontal' | 'vertical';
  className?: string;
};

// Escolha do tema: sistema, claro ou escuro. A escolha vale para toda a aplicação.
export const ThemeToggle = ({ className, orientation = 'horizontal', tone }: ThemeToggleProps) => {
  const { preference, setPreference } = useThemeStore();

  // No header a dica abre para baixo; na sidebar recolhida, para o lado do conteúdo.
  const tooltipSide = tone === 'header' ? 'bottom' : orientation === 'vertical' ? 'right' : 'top';

  return (
    <Box
      aria-label="Tema"
      className={cn(themeToggleVariants({ orientation, tone }), className)}
      role="group"
    >
      {themeOptions.map(({ icon: Icon, label, value }) => (
        <TooltipHint key={value} label={label} side={tooltipSide}>
          <Button
            aria-label={label}
            aria-pressed={preference === value}
            className={themeOptionVariants({ tone })}
            size="icon"
            type="button"
            variant="ghost"
            onClick={() => setPreference(value)}
          >
            <Icon />
          </Button>
        </TooltipHint>
      ))}
    </Box>
  );
};
