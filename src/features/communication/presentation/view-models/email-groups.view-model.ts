import { authSessionQueryOptions } from '@/features/auth/application/queries/auth-session.query';
import {
  EMAIL_GROUPS_QUERY_KEY,
  emailGroupListQueryOptions,
} from '@/features/communication/application/queries/communication.query';
import { deleteEmailGroupUseCase } from '@/features/communication/application/use-cases/delete-email-group.use-case';
import type { EmailGroupSummary } from '@/features/communication/domain/email-group';
import {
  getCommunicationNotice,
  getServerDetail,
} from '@/features/communication/presentation/models/email-groups.model';
import { useGlobalLoading } from '@/shared/feedback/global-loading';
import { notify } from '@/shared/feedback/notify';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const useEmailGroupsViewModel = () => {
  const { t } = useTranslation('communication');

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { data: session } = useQuery(authSessionQueryOptions);

  const [deleteTarget, setDeleteTarget] = useState<EmailGroupSummary | null>(null);

  const {
    data = [],
    error,
    isFetching,
    isPending,
    refetch,
  } = useQuery(emailGroupListQueryOptions());

  const { isPending: isDeleting, mutate } = useMutation({
    mutationFn: ({ csrfToken, id }: { csrfToken: string; id: string }) =>
      deleteEmailGroupUseCase({ csrfToken, id }),
    onSuccess: async () => {
      const name = deleteTarget?.name ?? '';

      setDeleteTarget(null);

      notify.success({
        title: t('deleteDialog.success.title'),
        description: t('deleteDialog.success.description', { name }),
      });

      await queryClient.invalidateQueries({ queryKey: EMAIL_GROUPS_QUERY_KEY });
    },
    onError: async (deleteError) => {
      setDeleteTarget(null);

      const notice = getCommunicationNotice(deleteError);

      notify.error({
        title: t(`notices.${notice}.title`),
        description: getServerDetail(deleteError) ?? t(`notices.${notice}.description`),
      });

      await queryClient.invalidateQueries({ queryKey: EMAIL_GROUPS_QUERY_KEY });
    },
  });

  useGlobalLoading(isDeleting);

  const items = data.map((group) => ({
    group,
    recipientCount: t('list.recipientCount', { count: group.recipientCount }),
  }));

  const openGroup = (group: EmailGroupSummary) => {
    void navigate({ to: '/comunicacao/emails/grupos/$groupId', params: { groupId: group.id } });
  };

  const requestDelete = (group: EmailGroupSummary) => {
    setDeleteTarget(group);
  };

  const cancelDelete = () => {
    setDeleteTarget(null);
  };

  const confirmDelete = () => {
    if (!deleteTarget || !session || isDeleting) {
      return;
    }

    mutate({ csrfToken: session.csrfToken, id: deleteTarget.id });
  };

  return {
    cancelDelete,
    confirmDelete,
    deleteTarget,
    errorNotice: error ? getCommunicationNotice(error) : null,
    isDeleting,
    isLoading: isPending,
    isRetrying: isFetching,
    items,
    openGroup,
    requestDelete,
    retry: () => void refetch(),
  };
};
