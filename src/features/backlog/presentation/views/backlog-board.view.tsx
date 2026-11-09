import {
  Alert,
  AlertDescription,
  AlertTitle,
  Box,
  Button,
  Heading,
  Spinner,
  Text,
} from '@/components/ui';
import {
  BacklogStatusAccent,
  BacklogStatusBadge,
} from '@/features/backlog/presentation/components/backlog-badges';
import { BacklogBoardCarousel } from '@/features/backlog/presentation/components/backlog-board-carousel';
import { BacklogCardDialog } from '@/features/backlog/presentation/components/backlog-card-dialog';
import { BacklogCardItem } from '@/features/backlog/presentation/components/backlog-card-item';
import { DeleteBacklogCardDialog } from '@/features/backlog/presentation/components/delete-backlog-card-dialog';
import { useBacklogBoardViewModel } from '@/features/backlog/presentation/view-models/backlog-board.view-model';
import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';
import { ArrowLeftIcon, CircleAlertIcon, PlusIcon, RefreshCwIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Quadro do backlog de Tecnologia: uma coluna por etapa, na ordem do caminho que o card percorre.
export const BacklogBoardView = () => {
  const {
    canDropOn,
    cancelDelete,
    closeEditor,
    columns,
    confirmDelete,
    deleteTarget,
    draggingCardId,
    dropOn,
    editor,
    endDrag,
    errorNotice,
    isDeleting,
    isLoading,
    isMoving,
    isRetrying,
    moveCard,
    openCreate,
    openEdit,
    requestDelete,
    retry,
    startDrag,
  } = useBacklogBoardViewModel();

  const { t } = useTranslation('backlog');

  return (
    <Box className="grid grid-cols-[minmax(0,1fr)] gap-6">
      <Link
        className="
          inline-flex w-fit items-center gap-1.5 text-sm font-medium text-primary-strong
          hover:underline
        "
        to="/departamentos/tecnologia"
      >
        <ArrowLeftIcon aria-hidden="true" className="size-4" />
        {t('board.back')}
      </Link>

      <Box className="flex flex-wrap items-end justify-between gap-4">
        <Box>
          <Heading className="text-2xl font-semibold tracking-tight text-foreground">
            {t('title')}
          </Heading>

          <Text className="mt-1 text-muted-foreground">{t('subtitle')}</Text>
        </Box>

        <Button
          className="h-11 w-full sm:w-auto sm:px-5"
          type="button"
          onClick={() => openCreate('CREATED')}
        >
          <PlusIcon data-icon="inline-start" />
          {t('board.create')}
        </Button>
      </Box>

      {isLoading && (
        <Box className="flex min-h-64 items-center justify-center">
          <Spinner className="size-7 text-primary-strong" />
        </Box>
      )}

      {errorNotice && !isLoading && (
        <Alert variant="destructive">
          <CircleAlertIcon />

          <AlertTitle>{t(`notices.${errorNotice}.title`)}</AlertTitle>

          <AlertDescription className="grid gap-3">
            {t(`notices.${errorNotice}.description`)}

            <Button
              className="w-fit"
              disabled={isRetrying}
              size="sm"
              type="button"
              variant="outline"
              onClick={retry}
            >
              <RefreshCwIcon data-icon="inline-start" />
              {t('board.retry')}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {!isLoading && !errorNotice && (
        <BacklogBoardCarousel>
          {columns.map(({ cards, status }) => {
            const isDropTarget = canDropOn(status);

            return (
              <Box
                key={status}
                className={cn(
                  `
                    flex h-[calc(100dvh-21rem)] min-h-96 w-72 shrink-0 flex-col overflow-hidden
                    rounded-xl border border-border bg-muted/40 transition-colors
                  `,
                  isDropTarget && 'border-primary bg-primary/5',
                )}
                onDragOver={(event) => {
                  if (isDropTarget) {
                    event.preventDefault();
                  }
                }}
                onDrop={(event) => {
                  event.preventDefault();

                  dropOn(status);
                }}
              >
                <BacklogStatusAccent status={status} />

                <Box className="grid gap-3 p-3">
                  <Box className="flex items-center justify-between gap-2">
                    <BacklogStatusBadge status={status} />

                    <Text className="rounded-full bg-muted px-2 text-xs font-semibold tabular-nums">
                      {cards.length}
                    </Text>
                  </Box>

                  <Button
                    aria-label={t('board.addCardTo', { status: t(`statuses.${status}`) })}
                    className="w-full border-dashed"
                    size="sm"
                    type="button"
                    variant="outline"
                    onClick={() => openCreate(status)}
                  >
                    <PlusIcon data-icon="inline-start" />
                    {t('board.addCard')}
                  </Button>
                </Box>

                <Box className="grid flex-1 content-start gap-3 overflow-y-auto px-3 pb-3">
                  {cards.map((card) => (
                    <BacklogCardItem
                      key={card.id}
                      card={card}
                      isDragging={draggingCardId === card.id}
                      isMoveDisabled={isMoving}
                      onDelete={() => requestDelete(card)}
                      onDragEnd={endDrag}
                      onDragStart={() => startDrag(card)}
                      onEdit={() => openEdit(card)}
                      onMove={(nextStatus) => moveCard(card, nextStatus)}
                    />
                  ))}
                </Box>
              </Box>
            );
          })}
        </BacklogBoardCarousel>
      )}

      {editor && (
        <BacklogCardDialog
          key={editor.card?.id ?? `new-${editor.status}`}
          card={editor.card}
          status={editor.status}
          onClose={closeEditor}
        />
      )}

      <DeleteBacklogCardDialog
        cardTitle={deleteTarget?.title ?? null}
        isPending={isDeleting}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
      />
    </Box>
  );
};
