import { Box, Text } from '@/components/ui';
import type { BacklogCardStatus, BacklogCardType } from '@/features/backlog/domain/backlog-card';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

const BADGE_CLASS =
  'inline-flex h-6 shrink-0 items-center rounded-full border px-2.5 text-xs font-semibold text-foreground';

const STATUS_CLASSES: Record<BacklogCardStatus, string> = {
  CREATED: 'border-muted-foreground/50 bg-muted-foreground/15',
  PRIORITIZED: 'border-chart-3/60 bg-chart-3/20',
  REFINED: 'border-chart-2/60 bg-chart-2/20',
  IN_PROGRESS: 'border-chart-1/60 bg-chart-1/20',
  TESTING: 'border-backlog-testing/60 bg-backlog-testing/20',
  HOMOLOGATED: 'border-backlog-homologated/60 bg-backlog-homologated/20',
  DONE: 'border-success/60 bg-success/20',
  DEPLOYED: 'border-backlog-deployed/60 bg-backlog-deployed/20',
};

const TYPE_CLASSES: Record<BacklogCardType, string> = {
  FEATURE: 'border-primary/60 bg-primary/20',
  BUG: 'border-destructive/60 bg-destructive/20',
  ADJUSTMENT: 'border-chart-3/60 bg-chart-3/20',
};

const ACCENT_CLASSES: Record<BacklogCardStatus, string> = {
  CREATED: 'bg-muted-foreground/60',
  PRIORITIZED: 'bg-chart-3',
  REFINED: 'bg-chart-2',
  IN_PROGRESS: 'bg-chart-1',
  TESTING: 'bg-backlog-testing',
  HOMOLOGATED: 'bg-backlog-homologated',
  DONE: 'bg-success',
  DEPLOYED: 'bg-backlog-deployed',
};

// Faixa no topo da coluna, na cor do status.
export const BacklogStatusAccent = ({ status }: { status: BacklogCardStatus }) => {
  return <Box aria-hidden="true" className={cn('h-1 shrink-0', ACCENT_CLASSES[status])} />;
};

export const BacklogStatusBadge = ({ status }: { status: BacklogCardStatus }) => {
  const { t } = useTranslation('backlog');

  return <Text className={cn(BADGE_CLASS, STATUS_CLASSES[status])}>{t(`statuses.${status}`)}</Text>;
};

export const BacklogTypeBadge = ({ type }: { type: BacklogCardType }) => {
  const { t } = useTranslation('backlog');

  return <Text className={cn(BADGE_CLASS, TYPE_CLASSES[type])}>{t(`types.${type}`)}</Text>;
};
