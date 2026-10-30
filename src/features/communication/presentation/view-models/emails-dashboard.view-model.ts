import { emailGroupListQueryOptions } from '@/features/communication/application/queries/communication.query';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

export const useEmailsDashboardViewModel = () => {
  const { t } = useTranslation('communication');

  const { data: groups, isPending } = useQuery(emailGroupListQueryOptions());

  // O card abre a lista mesmo sem os dados (falha ou carregando); os números só aparecem com eles.
  // A soma conta a mesma conta uma vez por grupo em que ela está.
  const getDetails = () => {
    if (!groups) {
      return null;
    }

    return t('dashboard.cards.groups.details', {
      count: groups.reduce((sum, { recipientCount }) => sum + recipientCount, 0),
    });
  };

  const groupsCard = {
    total: groups ? String(groups.length) : null,
    details: getDetails(),
    isLoading: isPending,
  };

  return { groupsCard };
};
