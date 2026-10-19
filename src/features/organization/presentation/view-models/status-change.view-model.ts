import { authSessionQueryOptions } from '@/features/auth/application/queries/auth-session.query';
import { ORGANIZATION_QUERY_KEY } from '@/features/organization/application/queries/organization.query';
import { changeCongregationStatusUseCase } from '@/features/organization/application/use-cases/change-congregation-status.use-case';
import { changeOrganizationStatusUseCase } from '@/features/organization/application/use-cases/change-organization-status.use-case';
import {
  OrganizationConflictError,
  type Congregation,
  type Organization,
} from '@/features/organization/domain/organization';
import {
  getConflictDetail,
  getOrganizationNotice,
  type StatusChangeRequest,
} from '@/features/organization/presentation/models/organization.model';
import { notify } from '@/shared/feedback/notify';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type StatusChangeInput = StatusChangeRequest & {
  csrfToken: string;
};

const changeStatus = ({
  action,
  congregationId,
  csrfToken,
}: StatusChangeInput): Promise<Organization | Congregation> => {
  return congregationId
    ? changeCongregationStatusUseCase(csrfToken, congregationId, action)
    : changeOrganizationStatusUseCase(csrfToken, action);
};

// Ativação/inativação com confirmação, da organização ou de uma congregação.
export const useStatusChangeViewModel = () => {
  const { t } = useTranslation('organization');

  const queryClient = useQueryClient();

  const { data: session } = useQuery(authSessionQueryOptions);

  const [request, setRequest] = useState<StatusChangeRequest | null>(null);

  const refresh = () => {
    return queryClient.invalidateQueries({ queryKey: ORGANIZATION_QUERY_KEY });
  };

  const { isPending, mutate } = useMutation({
    mutationFn: changeStatus,
    onSuccess: async ({ status }, { action, name }) => {
      setRequest(null);

      await refresh();

      notify.success({
        title: t(`statusDialog.success.${action}`),
        description: t('statusDialog.success.description', {
          name,
          status: t(`status.${status}`),
        }),
      });
    },
    onError: async (error) => {
      setRequest(null);

      const notice = getOrganizationNotice(error);

      notify.error({
        title: t(`notices.${notice}.title`),
        description: getConflictDetail(error) ?? t(`notices.${notice}.description`),
      });

      // Conflito: os dados exibidos estão desatualizados.
      if (error instanceof OrganizationConflictError) {
        await refresh();
      }
    },
  });

  const requestStatusChange = (nextRequest: StatusChangeRequest) => {
    setRequest(nextRequest);
  };

  const cancelStatusChange = () => {
    setRequest(null);
  };

  const confirmStatusChange = () => {
    if (!request || !session || isPending) {
      return;
    }

    mutate({ ...request, csrfToken: session.csrfToken });
  };

  return {
    cancelStatusChange,
    confirmStatusChange,
    isChangingStatus: isPending,
    requestStatusChange,
    statusChangeRequest: request,
  };
};
