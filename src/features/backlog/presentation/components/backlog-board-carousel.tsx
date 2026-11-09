import { Box, Button } from '@/components/ui';
import { useBoardCarousel } from '@/features/backlog/presentation/view-models/board-carousel.view-model';
import { cn } from '@/lib/utils';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

// No toque as setas somem e o quadro desliza com o dedo.
const ARROW_CLASS =
  'absolute top-1/2 hidden size-10 -translate-y-1/2 rounded-full shadow-elevated md:inline-flex';

type BacklogBoardCarouselProps = {
  // As colunas do quadro.
  children: ReactNode;
};

// Área do quadro sem barra de rolagem: as colunas passam pelas setas laterais ou arrastando o fundo.
export const BacklogBoardCarousel = ({ children }: BacklogBoardCarouselProps) => {
  const {
    canScrollNext,
    canScrollPrevious,
    handleDragOver,
    isPanning,
    scrollNext,
    scrollPrevious,
    scrollerProps,
  } = useBoardCarousel();

  const { t } = useTranslation('backlog');

  return (
    <Box className="relative md:px-14" onDragOver={handleDragOver}>
      <Button
        aria-label={t('board.previous')}
        className={cn(ARROW_CLASS, 'left-0')}
        disabled={!canScrollPrevious}
        size="icon"
        type="button"
        variant="outline"
        onClick={scrollPrevious}
      >
        <ChevronLeftIcon className="size-5" />
      </Button>

      <Box
        aria-label={t('board.label')}
        className={cn(
          `
            flex gap-4 overflow-x-auto select-none [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
          `,
          isPanning ? 'cursor-grabbing' : 'cursor-grab',
        )}
        role="group"
        {...scrollerProps}
      >
        {children}
      </Box>

      <Button
        aria-label={t('board.next')}
        className={cn(ARROW_CLASS, 'right-0')}
        disabled={!canScrollNext}
        size="icon"
        type="button"
        variant="outline"
        onClick={scrollNext}
      >
        <ChevronRightIcon className="size-5" />
      </Button>
    </Box>
  );
};
