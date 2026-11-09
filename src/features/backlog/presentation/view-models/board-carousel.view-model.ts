import { useEffect, useRef, useState, type DragEvent, type PointerEvent } from 'react';

// O que continua com o próprio comportamento: botões, links e cards (arrastados entre colunas).
const NO_PAN_SELECTOR = 'button, a, input, textarea, [draggable="true"], [role="menu"]';

// Faixa das laterais que avança o quadro enquanto um card é arrastado, e o intervalo entre avanços.
const DRAG_EDGE_WIDTH = 72;

const DRAG_EDGE_INTERVAL_MS = 500;

type Pan = { startX: number; startScrollLeft: number };

const getScrollBehavior = (): ScrollBehavior => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
};

// Largura de uma coluna somada ao espaço entre as colunas.
const getColumnStep = (scroller: HTMLElement) => {
  const columnWidth = scroller.firstElementChild?.getBoundingClientRect().width ?? 0;

  return columnWidth + Number.parseFloat(getComputedStyle(scroller).columnGap);
};

// Faz o quadro do backlog andar como um carrossel: pelas setas, segurando e arrastando o fundo ou
// levando um card até as laterais. No toque, vale a rolagem nativa do navegador.
export const useBoardCarousel = () => {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const panRef = useRef<Pan | null>(null);

  const lastEdgeStepRef = useRef(0);

  const [canScrollPrevious, setCanScrollPrevious] = useState(false);

  const [canScrollNext, setCanScrollNext] = useState(false);

  const [isPanning, setIsPanning] = useState(false);

  const syncArrows = (scroller: HTMLElement) => {
    setCanScrollPrevious(scroller.scrollLeft > 1);

    setCanScrollNext(scroller.scrollLeft + scroller.clientWidth < scroller.scrollWidth - 1);
  };

  useEffect(() => {
    const scroller = scrollerRef.current;

    if (!scroller) {
      return undefined;
    }

    const observer = new ResizeObserver(() => {
      setCanScrollPrevious(scroller.scrollLeft > 1);

      setCanScrollNext(scroller.scrollLeft + scroller.clientWidth < scroller.scrollWidth - 1);
    });

    observer.observe(scroller);

    return () => observer.disconnect();
  }, []);

  const scrollByColumns = (columns: number) => {
    const scroller = scrollerRef.current;

    if (scroller) {
      scroller.scrollBy({
        left: columns * getColumnStep(scroller),
        behavior: getScrollBehavior(),
      });
    }
  };

  // As setas andam uma tela de colunas inteiras por vez.
  const scrollPage = (direction: -1 | 1) => {
    const scroller = scrollerRef.current;

    if (scroller) {
      const visibleColumns = Math.floor(scroller.clientWidth / getColumnStep(scroller));

      scrollByColumns(direction * Math.max(1, visibleColumns));
    }
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const isPlainMousePress = event.pointerType === 'mouse' && event.button === 0;

    if (!isPlainMousePress || (event.target as Element).closest(NO_PAN_SELECTOR)) {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);

    panRef.current = { startX: event.clientX, startScrollLeft: event.currentTarget.scrollLeft };

    setIsPanning(true);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (panRef.current) {
      const { startScrollLeft, startX } = panRef.current;

      event.currentTarget.scrollLeft = startScrollLeft - (event.clientX - startX);
    }
  };

  // Ao soltar, o quadro se acomoda na coluna mais próxima.
  const handlePointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    if (!panRef.current) {
      return;
    }

    panRef.current = null;

    setIsPanning(false);

    const scroller = event.currentTarget;

    const step = getColumnStep(scroller);

    scroller.scrollTo({
      left: Math.round(scroller.scrollLeft / step) * step,
      behavior: getScrollBehavior(),
    });
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    const { left, right } = event.currentTarget.getBoundingClientRect();

    const direction =
      event.clientX < left + DRAG_EDGE_WIDTH ? -1 : event.clientX > right - DRAG_EDGE_WIDTH ? 1 : 0;

    if (direction !== 0 && event.timeStamp - lastEdgeStepRef.current > DRAG_EDGE_INTERVAL_MS) {
      lastEdgeStepRef.current = event.timeStamp;

      scrollByColumns(direction);
    }
  };

  return {
    canScrollNext,
    canScrollPrevious,
    handleDragOver,
    isPanning,
    scrollNext: () => scrollPage(1),
    scrollPrevious: () => scrollPage(-1),
    scrollerProps: {
      ref: scrollerRef,
      onPointerCancel: handlePointerEnd,
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerEnd,
      onScroll: (event: { currentTarget: HTMLDivElement }) => syncArrows(event.currentTarget),
    },
  };
};
