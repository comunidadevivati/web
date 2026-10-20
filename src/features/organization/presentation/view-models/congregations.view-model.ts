import { congregationsQueryOptions } from '@/features/organization/application/queries/organization.query';
import type { Congregation } from '@/features/organization/domain/organization';
import {
  CONGREGATION_STATUS_FILTERS,
  getOrganizationNotice,
  type CongregationStatusFilter,
} from '@/features/organization/presentation/models/organization.model';
import { useStatusChangeViewModel } from '@/features/organization/presentation/view-models/status-change.view-model';
import { formatPostalCode } from '@/shared/validation/brazilian-address';
import { formatPhone } from '@/shared/validation/brazilian-phone';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

// Congregação pronta para exibição no card da lista.
export type CongregationListItem = {
  congregation: Congregation;
  addressLine: string;
  region: string;
  phone: string | null;
};

export const useCongregationsViewModel = () => {
  const { t } = useTranslation('organization');

  const [statusFilter, setStatusFilter] = useState<CongregationStatusFilter>('ALL');

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isPending,
    refetch,
  } = useInfiniteQuery(congregationsQueryOptions(statusFilter === 'ALL' ? null : statusFilter));

  const statusChange = useStatusChangeViewModel();

  const { requestStatusChange } = statusChange;

  const [isFormOpen, setIsFormOpen] = useState(false);

  // Congregação em edição; null registra uma nova.
  const [formCongregation, setFormCongregation] = useState<Congregation | null>(null);

  // Cada abertura monta um formulário novo, com os dados atuais.
  const [formKey, setFormKey] = useState(0);

  const items: CongregationListItem[] = (data?.pages ?? [])
    .flatMap(({ items: page }) => page)
    .map((congregation) => {
      const { address, phone } = congregation;

      return {
        congregation,
        addressLine: `${address.street}, ${address.number} - ${address.district}`,
        region: t('details.region', {
          city: address.city,
          state: address.state,
          postalCode: formatPostalCode(address.postalCode),
        }),
        phone: phone ? formatPhone(phone) : null,
      };
    });

  const openForm = (congregation: Congregation | null) => {
    setFormKey((key) => key + 1);

    setFormCongregation(congregation);

    setIsFormOpen(true);
  };

  const openCreate = () => {
    openForm(null);
  };

  const openEdit = (congregation: Congregation) => {
    openForm(congregation);
  };

  const toggleStatus = ({ id, name, status }: Congregation) => {
    requestStatusChange({
      action: status === 'ACTIVE' ? 'deactivate' : 'activate',
      name,
      congregationId: id,
    });
  };

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  };

  const retry = () => {
    void refetch();
  };

  const filters = CONGREGATION_STATUS_FILTERS.map((value) => ({
    value,
    label: t(`congregationsPage.filters.${value}`),
    isSelected: value === statusFilter,
  }));

  return {
    ...statusChange,
    errorNotice: error ? getOrganizationNotice(error) : null,
    filters,
    formCongregation,
    formKey,
    hasNextPage,
    isFormOpen,
    isLoading: isPending,
    isLoadingMore: isFetchingNextPage,
    isRetrying: isFetching,
    items,
    loadMore,
    openCreate,
    openEdit,
    retry,
    setIsFormOpen,
    setStatusFilter,
    toggleStatus,
  };
};
