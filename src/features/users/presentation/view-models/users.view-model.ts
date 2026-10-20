import { authSessionQueryOptions } from '@/features/auth/application/queries/auth-session.query';
import {
  USERS_QUERY_KEY,
  usersQueryOptions,
} from '@/features/users/application/queries/users.query';
import { runUserActionUseCase } from '@/features/users/application/use-cases/run-user-action.use-case';
import { UserConflictError, type UserAccount } from '@/features/users/domain/user';
import {
  createDateTimeFormatter,
  getUserActions,
  getUsersErrorDetail,
  getUsersNotice,
  isUserFilterSelected,
  NO_USER_FILTERS,
  toggleUserFilter,
  USER_FILTERS,
  type UserActionRequest,
  type UserFilter,
  type UserFilterSelection,
} from '@/features/users/presentation/models/users.model';
import { notify } from '@/shared/feedback/notify';
import { formatPhone } from '@/shared/validation/brazilian-phone';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';

export const useUsersViewModel = () => {
  const { i18n, t } = useTranslation('users');

  const queryClient = useQueryClient();

  const { data: session } = useQuery(authSessionQueryOptions);

  const currentUserId = session?.user.subject ?? '';

  const [filterSelection, setFilterSelection] = useState<UserFilterSelection>(NO_USER_FILTERS);

  // Texto digitado e busca aplicada (somente ao enviar, para não consultar a cada tecla).
  const [searchDraft, setSearchDraft] = useState('');

  const [search, setSearch] = useState('');

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);

  const [isEditOpen, setIsEditOpen] = useState(false);

  // Cada abertura monta um formulário novo, com os dados atuais.
  const [formKey, setFormKey] = useState(0);

  const [actionRequest, setActionRequest] = useState<UserActionRequest | null>(null);

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
    usersQueryOptions({
      ...filterSelection,
      // Quem já virou Pessoa (e membro) sai da lista de usuários: aparece em Membros.
      hasPerson: false,
      search: search || null,
    }),
  );

  const refresh = () => {
    return queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
  };

  const { isPending: isRunningAction, mutate } = useMutation({
    mutationFn: ({ csrfToken, request }: { csrfToken: string; request: UserActionRequest }) =>
      runUserActionUseCase(csrfToken, request.user.id, request.action),
    onSuccess: async (_result, { request: { action, user } }) => {
      setActionRequest(null);

      await refresh();

      notify.success({
        title: t(`confirm.success.${action}`),
        description: t('confirm.success.description', { name: user.name }),
      });
    },
    onError: async (actionError) => {
      setActionRequest(null);

      const notice = getUsersNotice(actionError);

      notify.error({
        title: t(`notices.${notice}.title`),
        description: getUsersErrorDetail(actionError) ?? t(`notices.${notice}.description`),
      });

      if (actionError instanceof UserConflictError) {
        await refresh();
      }
    },
  });

  const formatDateTime = createDateTimeFormatter(i18n.language, (parts) =>
    t('listPage.dateTime', parts),
  );

  const items = (data?.pages ?? [])
    .flatMap(({ items: page }) => page)
    .map((user) => ({
      user,
      isCurrentUser: user.id === currentUserId,
      phone: user.phone ? formatPhone(user.phone) : null,
      createdAt: formatDateTime(user.createdAt),
      suspendedAt: user.suspendedAt ? formatDateTime(user.suspendedAt) : null,
      actions: getUserActions(user, currentUserId),
    }));

  // "Todas" não se combina com os outros e não tem o "X" de remover.
  const filters = USER_FILTERS.map((value) => {
    const label = t(`listPage.filters.${value}`);

    const isSelected = isUserFilterSelected(filterSelection, value);

    return {
      value,
      label,
      isSelected,
      isRemovable: isSelected && value !== 'ALL',
      removeLabel: t('listPage.removeFilter', { filter: label }),
    };
  });

  const toggleFilter = (filter: UserFilter) => {
    setFilterSelection((selection) => toggleUserFilter(selection, filter));
  };

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();

    setSearch(searchDraft.trim());
  };

  const openCreate = () => {
    setFormKey((key) => key + 1);

    setIsCreateOpen(true);
  };

  const openEdit = (user: UserAccount) => {
    setFormKey((key) => key + 1);

    setEditingUser(user);

    setIsEditOpen(true);
  };

  const requestAction = (request: UserActionRequest) => {
    setActionRequest(request);
  };

  const cancelAction = () => {
    setActionRequest(null);
  };

  const confirmAction = () => {
    if (!actionRequest || !session || isRunningAction) {
      return;
    }

    mutate({ csrfToken: session.csrfToken, request: actionRequest });
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
    actionRequest,
    cancelAction,
    confirmAction,
    editingUser,
    errorNotice: error ? getUsersNotice(error) : null,
    filters,
    formKey,
    hasNextPage,
    isCreateOpen,
    isEditOpen,
    isLoading: isPending,
    isLoadingMore: isFetchingNextPage,
    isRetrying: isFetching,
    isRunningAction,
    items,
    loadMore,
    openCreate,
    openEdit,
    requestAction,
    retry,
    searchDraft,
    setIsCreateOpen,
    setIsEditOpen,
    setSearchDraft,
    submitSearch,
    toggleFilter,
  };
};
