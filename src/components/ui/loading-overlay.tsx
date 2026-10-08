import { Spinner } from '@/components/ui/spinner';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export const LoadingOverlay = () => {
  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;

    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';

    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousBodyOverflow;

      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, []);

  return createPortal(
    <div
      aria-busy="true"
      aria-label="Carregando"
      className="
        fixed inset-0 z-[9999] flex h-dvh w-dvw cursor-wait items-center justify-center
        overflow-hidden bg-background/70 text-foreground backdrop-blur-sm
      "
      role="status"
    >
      <Spinner aria-hidden="true" className="size-10 text-primary" />
    </div>,
    document.body,
  );
};
