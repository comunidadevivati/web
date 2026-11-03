import { StatusBadge, type StatusBadgeTone } from '@/components/molecules';
import type { EmailGroupType } from '@/features/communication/domain/email-group';
import { useTranslation } from 'react-i18next';

// Restrito só tem contas verificadas; aberto tem e-mails informados à mão (sem verificação).
const TONES: Record<EmailGroupType, StatusBadgeTone> = {
  RESTRICTED: 'success',
  MIXED: 'info',
  OPEN: 'warning',
};

type EmailGroupTypeBadgeProps = {
  type: EmailGroupType;
};

// Tipo do grupo (restrito, aberto ou misto), sempre visível junto ao grupo.
export const EmailGroupTypeBadge = ({ type }: EmailGroupTypeBadgeProps) => {
  const { t } = useTranslation('communication');

  return <StatusBadge label={t(`groupTypes.${type}.label`)} tone={TONES[type]} />;
};
