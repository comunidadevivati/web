import { StatusBadge } from '@/components/molecules';
import type { UserAccount } from '@/features/users/domain/user';
import { userStatusTones } from '@/features/users/presentation/models/users.model';
import { useTranslation } from 'react-i18next';

type UserBadgeProps = {
  user: UserAccount;
};

// Verificação do e-mail da conta (Verificada / Não verificada).
export const UserVerificationBadge = ({ user }: UserBadgeProps) => {
  const { t } = useTranslation('users');

  return user.emailVerified ? (
    <StatusBadge label={t('verification.verified')} tone="success" />
  ) : (
    <StatusBadge label={t('verification.unverified')} tone="warning" />
  );
};

// Identifica a conta logada, que não pode ser suspensa nem excluída.
export const CurrentUserBadge = () => {
  const { t } = useTranslation('users');

  return <StatusBadge label={t('listPage.you')} tone="neutral" />;
};

type UserStatusBadgeProps = UserBadgeProps & {
  // Data e hora da suspensão já formatadas.
  suspendedAt: string | null;
};

// Situação da conta (Ativa / Suspensa em data e hora).
export const UserStatusBadge = ({ suspendedAt, user }: UserStatusBadgeProps) => {
  const { t } = useTranslation('users');

  const label =
    user.status === 'SUSPENDED' && suspendedAt
      ? t('status.suspendedAt', { dateTime: suspendedAt })
      : t(`status.${user.status}`);

  return <StatusBadge label={label} tone={userStatusTones[user.status]} />;
};
