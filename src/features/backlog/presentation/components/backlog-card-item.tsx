import { TooltipHint } from '@/components/molecules';
import {
  Box,
  Button,
  buttonVariants,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Text,
} from '@/components/ui';
import {
  BACKLOG_CARD_STATUSES,
  canMoveCard,
  type BacklogCard,
  type BacklogCardStatus,
} from '@/features/backlog/domain/backlog-card';
import {
  BacklogStatusBadge,
  BacklogTypeBadge,
} from '@/features/backlog/presentation/components/backlog-badges';
import { BacklogCardDates } from '@/features/backlog/presentation/components/backlog-card-dates';
import { cn } from '@/lib/utils';
import { ArrowRightLeftIcon, Trash2Icon } from 'lucide-react';
import type { DragEvent } from 'react';
import { useTranslation } from 'react-i18next';

type BacklogCardItemProps = {
  card: BacklogCard;
  isDragging: boolean;
  isMoveDisabled: boolean;
  onDelete: () => void;
  onDragEnd: () => void;
  onDragStart: () => void;
  onEdit: () => void;
  onMove: (status: BacklogCardStatus) => void;
};

// Card do quadro: arrasta para qualquer coluna ou escolhe a etapa no menu (teclado e toque).
export const BacklogCardItem = ({
  card,
  isDragging,
  isMoveDisabled,
  onDelete,
  onDragEnd,
  onDragStart,
  onEdit,
  onMove,
}: BacklogCardItemProps) => {
  const { t } = useTranslation('backlog');

  const handleDragStart = (event: DragEvent<HTMLDivElement>) => {
    // O Firefox só inicia o arraste com algum dado definido.
    event.dataTransfer.setData('text/plain', card.id);

    event.dataTransfer.effectAllowed = 'move';

    onDragStart();
  };

  return (
    <Box
      className={cn(
        `
          grid cursor-grab gap-3 rounded-xl border border-border surface-card p-3 shadow-sm
          active:cursor-grabbing
        `,
        isDragging && 'opacity-50',
      )}
      draggable={!isMoveDisabled}
      onDragEnd={onDragEnd}
      onDragStart={handleDragStart}
    >
      <Box className="flex flex-wrap gap-1.5">
        <BacklogTypeBadge type={card.type} />

        <BacklogStatusBadge status={card.status} />
      </Box>

      <Box className="grid min-w-0 gap-1">
        <Button
          className="
            h-auto justify-start p-0 text-left font-semibold wrap-anywhere whitespace-normal
            text-foreground
          "
          type="button"
          variant="link"
          onClick={onEdit}
        >
          {card.title}
        </Button>

        <Text className="line-clamp-3 text-xs wrap-anywhere whitespace-pre-line">
          {card.description}
        </Text>
      </Box>

      <BacklogCardDates card={card} />

      <Box className="flex items-center justify-between">
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label={t('card.moveLabel', { title: card.title })}
            className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}
            disabled={isMoveDisabled}
          >
            <ArrowRightLeftIcon data-icon="inline-start" />
            {t('card.move')}
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" className="w-48">
            {BACKLOG_CARD_STATUSES.filter((status) => canMoveCard(card.status, status)).map(
              (status) => (
                <DropdownMenuItem key={status} className="px-2 py-2" onClick={() => onMove(status)}>
                  <BacklogStatusBadge status={status} />
                </DropdownMenuItem>
              ),
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <TooltipHint label={t('card.delete')}>
          <Button
            aria-label={t('card.delete')}
            className="text-destructive-strong"
            size="icon-sm"
            type="button"
            variant="ghost"
            onClick={onDelete}
          >
            <Trash2Icon />
          </Button>
        </TooltipHint>
      </Box>
    </Box>
  );
};
