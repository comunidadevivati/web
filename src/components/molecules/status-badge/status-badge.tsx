import { Text } from '@/components/ui';
import { cva } from 'class-variance-authority';

export type StatusBadgeTone = 'success' | 'warning' | 'neutral';

const statusBadgeVariants = cva(
  'inline-flex h-6 shrink-0 items-center rounded-full border px-2.5 text-xs font-semibold',
  {
    variants: {
      tone: {
        success: 'border-success/40 bg-success/10 text-success-strong',
        warning: 'border-chart-3/50 bg-chart-3/10 text-foreground',
        neutral: 'border-border bg-muted text-muted-foreground',
      },
    },
  },
);

type StatusBadgeProps = {
  tone: StatusBadgeTone;
  // Texto já traduzido.
  label: string;
};

// Situação de um registro (ex.: Ativo, Rascunho, Inativo), com cor funcional por tom.
export const StatusBadge = ({ label, tone }: StatusBadgeProps) => {
  return <Text className={statusBadgeVariants({ tone })}>{label}</Text>;
};
