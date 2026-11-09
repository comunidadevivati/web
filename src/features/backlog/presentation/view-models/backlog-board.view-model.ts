import { authSessionQueryOptions } from '@/features/auth/application/queries/auth-session.query';
import { backlogCardsQueryOptions } from '@/features/backlog/application/queries/backlog.query';
import { deleteBacklogCardUseCase } from '@/features/backlog/application/use-cases/delete-backlog-card.use-case';
import { moveBacklogCardUseCase } from '@/features/backlog/application/use-cases/move-backlog-card.use-case';
import {
  BACKLOG_CARD_STATUSES,
  canMoveCard,
  type BacklogCard,
  type BacklogCardStatus,
} from '@/features/backlog/domain/backlog-card';
import {
  getBacklogNotice,
  getServerDetail,
} from '@/features/backlog/presentation/models/backlog.model';
import { useGlobalLoading } from '@/shared/feedback/global-loading';
import { notify } from '@/shared/feedback/notify';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

// Diálogo de criação (card: null, na etapa indicada) ou edição do card.
type CardEditor = { card: BacklogCard | null; status: BacklogCardStatus };

type MoveCommand = { csrfToken: string; card: BacklogCard; status: BacklogCardStatus };

const { queryKey: CARDS_KEY } = backlogCardsQueryOptions();

export const useBacklogBoardViewModel = () => {
  const { t } = useTranslation('backlog');

  const queryClient = useQueryClient();

  const { data: session } = useQuery(authSessionQueryOptions);

  const [editor, setEditor] = useState<CardEditor | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<BacklogCard | null>(null);

  const [draggingCard, setDraggingCard] = useState<BacklogCard | null>(null);

  const { data = [], error, isFetching, isPending } = useQuery(backlogCardsQueryOptions());

  const showError = (failure: Error) => {
    const notice = getBacklogNotice(failure);

    notify.error({
      title: t(`notices.${notice}.title`),
      description: getServerDetail(failure) ?? t(`notices.${notice}.description`),
    });
  };

  const refreshCards = () => {
    return queryClient.invalidateQueries({ queryKey: CARDS_KEY });
  };

  // O card muda de coluna na hora; se o servidor recusar, volta para onde estava.
  const { isPending: isMoving, mutate: mutateMove } = useMutation({
    mutationFn: ({ card, csrfToken, status }: MoveCommand) =>
      moveBacklogCardUseCase({ card, csrfToken, status }),
    onMutate: async ({ card, status }) => {
      await queryClient.cancelQueries({ queryKey: CARDS_KEY });

      const previousCards = queryClient.getQueryData(CARDS_KEY);

      queryClient.setQueryData(CARDS_KEY, (cards) =>
        cards?.map((item) => (item.id === card.id ? { ...item, status } : item)),
      );

      return { previousCards };
    },
    onSuccess: (saved) => {
      queryClient.setQueryData(CARDS_KEY, (cards) =>
        cards?.map((item) => (item.id === saved.id ? saved : item)),
      );
    },
    onError: (moveError, _command, context) => {
      queryClient.setQueryData(CARDS_KEY, context?.previousCards);

      showError(moveError);
    },
    onSettled: () => refreshCards(),
  });

  const { isPending: isDeleting, mutate: mutateDelete } = useMutation({
    mutationFn: ({ csrfToken, id }: { csrfToken: string; id: string }) =>
      deleteBacklogCardUseCase({ csrfToken, id }),
    onSuccess: async () => {
      const title = deleteTarget?.title ?? '';

      setDeleteTarget(null);

      notify.success({
        title: t('deleteDialog.success.title'),
        description: t('deleteDialog.success.description', { title }),
      });

      await refreshCards();
    },
    onError: async (deleteError) => {
      setDeleteTarget(null);

      showError(deleteError);

      await refreshCards();
    },
  });

  useGlobalLoading(isDeleting);

  const columns = BACKLOG_CARD_STATUSES.map((status) => ({
    status,
    cards: data.filter((card) => card.status === status),
  }));

  const moveCard = (card: BacklogCard, status: BacklogCardStatus) => {
    if (!session || isMoving || !canMoveCard(card.status, status)) {
      return;
    }

    mutateMove({ csrfToken: session.csrfToken, card, status });
  };

  const canDropOn = (status: BacklogCardStatus) => {
    return draggingCard !== null && canMoveCard(draggingCard.status, status);
  };

  const dropOn = (status: BacklogCardStatus) => {
    if (draggingCard) {
      moveCard(draggingCard, status);
    }

    setDraggingCard(null);
  };

  const confirmDelete = () => {
    if (!deleteTarget || !session || isDeleting) {
      return;
    }

    mutateDelete({ csrfToken: session.csrfToken, id: deleteTarget.id });
  };

  return {
    canDropOn,
    cancelDelete: () => setDeleteTarget(null),
    closeEditor: () => setEditor(null),
    columns,
    confirmDelete,
    deleteTarget,
    draggingCardId: draggingCard?.id ?? null,
    dropOn,
    endDrag: () => setDraggingCard(null),
    errorNotice: error ? getBacklogNotice(error) : null,
    isDeleting,
    isLoading: isPending,
    isMoving,
    isRetrying: isFetching,
    editor,
    moveCard,
    openCreate: (status: BacklogCardStatus) => setEditor({ card: null, status }),
    openEdit: (card: BacklogCard) => setEditor({ card, status: card.status }),
    requestDelete: setDeleteTarget,
    retry: () => void refreshCards(),
    startDrag: setDraggingCard,
  };
};
