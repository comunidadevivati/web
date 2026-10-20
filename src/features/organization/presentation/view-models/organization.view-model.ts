import { organizationQueryOptions } from '@/features/organization/application/queries/organization.query';
import { getOrganizationNotice } from '@/features/organization/presentation/models/organization.model';
import { useStatusChangeViewModel } from '@/features/organization/presentation/view-models/status-change.view-model';
import { formatCnpj, formatPostalCode } from '@/shared/validation/brazilian-address';
import { formatPhone } from '@/shared/validation/brazilian-phone';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const useOrganizationViewModel = () => {
  const { t } = useTranslation('organization');

  const {
    data: organization,
    error,
    isFetching,
    isPending,
    refetch,
  } = useQuery(organizationQueryOptions);

  const statusChange = useStatusChangeViewModel();

  const { requestStatusChange } = statusChange;

  const [isEditOpen, setIsEditOpen] = useState(false);

  // Cada abertura monta um formulário novo, com os dados atuais.
  const [editFormKey, setEditFormKey] = useState(0);

  const openEdit = () => {
    setEditFormKey((key) => key + 1);

    setIsEditOpen(true);
  };

  const toggleStatus = () => {
    if (!organization) {
      return;
    }

    requestStatusChange({
      action: organization.status === 'ACTIVE' ? 'deactivate' : 'activate',
      name: organization.tradeName,
    });
  };

  const retry = () => {
    void refetch();
  };

  const details = organization && {
    cnpj: formatCnpj(organization.cnpj),
    phone: formatPhone(organization.phone),
    email: organization.email,
    addressLine: `${organization.address.street}, ${organization.address.number}`,
    complement: organization.address.complement,
    district: organization.address.district,
    region: t('details.region', {
      city: organization.address.city,
      state: organization.address.state,
      postalCode: formatPostalCode(organization.address.postalCode),
    }),
  };

  return {
    ...statusChange,
    details,
    editFormKey,
    errorNotice: error ? getOrganizationNotice(error) : null,
    isEditOpen,
    isLoading: isPending,
    isRetrying: isFetching,
    openEdit,
    organization,
    retry,
    setIsEditOpen,
    toggleStatus,
  };
};
