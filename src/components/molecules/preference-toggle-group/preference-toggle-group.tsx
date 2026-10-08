import { TooltipHint } from '@/components/molecules/tooltip-hint/tooltip-hint';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui';
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import type { ReactNode } from 'react';

export type PreferenceTone = 'header' | 'sidebar' | 'surface';

export type PreferenceOrientation = 'horizontal' | 'vertical';

export type PreferenceSize = 'default' | 'sm';

export type PreferenceOption<TValue extends string> = {
  value: TValue;
  label: string;
  content: ReactNode;
};

const groupVariants = cva('border', {
  variants: {
    size: {
      default: 'rounded-xl p-1',
      sm: 'rounded-lg p-0.5',
    },
    tone: {
      header: 'border-header-border bg-header-foreground/5',
      sidebar: 'border-sidebar-border bg-sidebar-accent/40',
      surface: 'border-border bg-card/70 backdrop-blur-sm',
    },
  },
});

const itemVariants = cva('px-0 font-semibold', {
  variants: {
    size: {
      default: 'size-10 min-w-10 rounded-lg text-xs',
      sm: "size-8 min-w-8 rounded-md text-[0.7rem] [&_svg:not([class*='size-'])]:size-3.5",
    },
    tone: {
      header: `
        text-header-foreground/70 hover:bg-header-accent/10 hover:text-header-accent-foreground
        focus-visible:ring-header-accent aria-pressed:bg-header-accent/15
        aria-pressed:text-header-accent-foreground
      `,
      sidebar: `
        text-sidebar-foreground hover:bg-sidebar-primary/10 hover:text-sidebar-primary-foreground
        aria-pressed:bg-sidebar-primary/20 aria-pressed:text-sidebar-primary-foreground
      `,
      surface: `
        text-muted-foreground hover:bg-primary/10 hover:text-primary-strong
        aria-pressed:bg-primary/20 aria-pressed:text-primary-strong
      `,
    },
  },
});

type PreferenceToggleGroupProps<TValue extends string> = {
  label: string;
  value: TValue;
  options: PreferenceOption<TValue>[];
  onValueChange: (value: TValue) => void;
  tone: PreferenceTone;
  orientation?: PreferenceOrientation;
  size?: PreferenceSize;
  className?: string;
};

// Grupo de escolha única (ToggleGroup do shadcn) para preferências como tema e idioma.
export const PreferenceToggleGroup = <TValue extends string>({
  className,
  label,
  onValueChange,
  options,
  orientation = 'horizontal',
  size = 'default',
  tone,
  value,
}: PreferenceToggleGroupProps<TValue>) => {
  // No header a dica abre para baixo; na sidebar recolhida, para o lado do conteúdo.
  const tooltipSide = tone === 'header' ? 'bottom' : orientation === 'vertical' ? 'right' : 'top';

  const handleValueChange = (groupValue: unknown[]) => {
    const selected = options.find((option) => option.value === groupValue[0]);

    // Escolha única obrigatória: ignora o clique que desmarcaria a opção atual.
    if (selected) {
      onValueChange(selected.value);
    }
  };

  return (
    <ToggleGroup
      aria-label={label}
      className={cn(groupVariants({ size, tone }), className)}
      orientation={orientation}
      spacing={1}
      value={[value]}
      onValueChange={handleValueChange}
    >
      {options.map((option) => (
        <TooltipHint key={option.value} label={option.label} side={tooltipSide}>
          <ToggleGroupItem
            aria-label={option.label}
            className={itemVariants({ size, tone })}
            value={option.value}
          >
            {option.content}
          </ToggleGroupItem>
        </TooltipHint>
      ))}
    </ToggleGroup>
  );
};
