import { emailGroupQueryOptions } from '@/features/communication/application/queries/communication.query';
import { getCommunicationNotice } from '@/features/communication/presentation/models/email-groups.model';
import { useQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';

export const useEmailGroupEditViewModel = () => {
  const { groupId } = useParams({ from: '/_authenticated/comunicacao/emails/grupos/$groupId' });

  const {
    data: group,
    error,
    isFetching,
    isPending,
    refetch,
  } = useQuery(emailGroupQueryOptions(groupId));

  const retry = () => {
    void refetch();
  };

  return {
    errorNotice: error && !group ? getCommunicationNotice(error) : null,
    group,
    isLoading: isPending,
    isRetrying: isFetching,
    retry,
  };
};
