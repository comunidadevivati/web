import { membersQueryOptions } from '@/features/members/application/queries/members.query';
import {
  ALL_CONGREGATIONS,
  getMembersNotice,
  MEMBER_STATUS_FILTERS,
  type MemberStatusFilter,
} from '@/features/members/presentation/models/members.model';
import { congregationOptionsQueryOptions } from '@/features/organization/application/queries/organization.query';
import { formatPhone } from '@/shared/validation/brazilian-phone';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';

export const useMembersViewModel = () => {
  const { i18n, t } = useTranslation('members');

  const [statusFilter, setStatusFilter] = useState<MemberStatusFilter>('ACTIVE');

  const [congregationFilter, setCongregationFilter] = useState<string>(ALL_CONGREGATIONS);

  // Texto digitado e busca aplicada (somente ao enviar, para não consultar a cada tecla).
  const [searchDraft, setSearchDraft] = useState('');

  const [search, setSearch] = useState('');

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Cada abertura monta um formulário novo.
  const [createFormKey, setCreateFormKey] = useState(0);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isPending,
    refetch,
  } = useInfiniteQuery(
    membersQueryOptions({
      status: statusFilter === 'ALL' ? null : statusFilter,
      congregationId: congregationFilter === ALL_CONGREGATIONS ? null : congregationFilter,
      search: search || null,
    }),
  );

  const { data: congregations = [] } = useQuery(congregationOptionsQueryOptions);

  const congregationOptions = [
    { value: ALL_CONGREGATIONS, label: t('listPage.allCongregations') },
    ...congregations.map(({ code, id, name }) => ({ value: id, label: `${name} (${code})` })),
  ];

  // Data civil ISO exibida no idioma atual, sem deslocamento de fuso.
  const dateFormatter = new Intl.DateTimeFormat(i18n.language, { timeZone: 'UTC' });

  const formatBirthDate = (iso: string) => {
    return t('listPage.birthDate', {
      date: dateFormatter.format(new Date(`${iso}T00:00:00Z`)),
    });
  };

  const items = (data?.pages ?? [])
    .flatMap(({ items: page }) => page)
    .map((member) => ({
      member,
      phone: member.phone ? formatPhone(member.phone) : null,
      birthDate: member.birthDate ? formatBirthDate(member.birthDate) : null,
    }));

  const filters = MEMBER_STATUS_FILTERS.map((value) => ({
    value,
    label: t(`listPage.filters.${value}`),
    isSelected: value === statusFilter,
  }));

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();

    setSearch(searchDraft.trim());
  };

  const openCreate = () => {
    setCreateFormKey((key) => key + 1);

    setIsCreateOpen(true);
  };

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  };

  const retry = () => {
    void refetch();
  };

  return {
    congregationFilter,
    congregationOptions,
    createFormKey,
    errorNotice: error ? getMembersNotice(error) : null,
    filters,
    hasNextPage,
    isCreateOpen,
    isLoading: isPending,
    isLoadingMore: isFetchingNextPage,
    isRetrying: isFetching,
    items,
    loadMore,
    openCreate,
    retry,
    searchDraft,
    setCongregationFilter,
    setIsCreateOpen,
    setSearchDraft,
    setStatusFilter,
    submitSearch,
  };
};
