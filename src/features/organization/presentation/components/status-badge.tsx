import { Text } from '@/components/ui';
import type { EntityStatus } from '@/features/organization/presentation/models/organization.model';
import { cva } from 'class-variance-authority';
import { useTranslation } from 'react-i18next';

const statusBadgeVariants = cva(
  'inline-flex h-6 shrink-0 items-center rounded-full border px-2.5 text-xs font-semibold',
  {
    variants: {
      status: {
        ACTIVE: 'border-success/40 bg-success/10 text-success-strong',
        DRAFT: 'border-chart-3/50 bg-chart-3/10 text-foreground',
        INACTIVE: 'border-border bg-muted text-muted-foreground',
      },
    },
  },
);

type StatusBadgeProps = {
  status: EntityStatus;
};

// Situação da organização ou da congregação (Ativa, Rascunho, Inativa).
export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const { t } = useTranslation('organization');

  return <Text className={statusBadgeVariants({ status })}>{t(`status.${status}`)}</Text>;
};
