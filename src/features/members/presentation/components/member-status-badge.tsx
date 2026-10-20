import { StatusBadge } from '@/components/molecules';
import type { MemberStatus, MembershipStatus } from '@/features/members/domain/member';
import {
  memberStatusTones,
  membershipStatusTones,
} from '@/features/members/presentation/models/members.model';
import { useTranslation } from 'react-i18next';

type MemberStatusBadgeProps = {
  status: MemberStatus;
};

// Situação do membro (Ativo, Inativo, Arquivado).
export const MemberStatusBadge = ({ status }: MemberStatusBadgeProps) => {
  const { t } = useTranslation('members');

  return <StatusBadge label={t(`status.${status}`)} tone={memberStatusTones[status]} />;
};

type MembershipStatusBadgeProps = {
  status: MembershipStatus;
};

// Situação do vínculo (Pendente, Ativo, Encerrado).
export const MembershipStatusBadge = ({ status }: MembershipStatusBadgeProps) => {
  const { t } = useTranslation('members');

  return (
    <StatusBadge label={t(`membershipStatus.${status}`)} tone={membershipStatusTones[status]} />
  );
};
