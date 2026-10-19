import { StatusBadge as StatusBadgeBase, type StatusBadgeTone } from '@/components/molecules';
import type { EntityStatus } from '@/features/organization/presentation/models/organization.model';
import { useTranslation } from 'react-i18next';

const tones: Record<EntityStatus, StatusBadgeTone> = {
  ACTIVE: 'success',
  DRAFT: 'warning',
  INACTIVE: 'neutral',
};

type StatusBadgeProps = {
  status: EntityStatus;
};

// Situação da organização ou da congregação (Ativa, Rascunho, Inativa).
export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const { t } = useTranslation('organization');

  return <StatusBadgeBase label={t(`status.${status}`)} tone={tones[status]} />;
};
