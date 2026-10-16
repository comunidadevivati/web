import { cn } from 'cn';
import type { ComponentProps } from 'react';

type SubtitleProps = ComponentProps<'p'>;

// Subtítulo padrão (abaixo de títulos de telas e cards): 1rem, semibold, cor subtitle com leve
// transparência. Use este componente em vez de estilizar Text para subtítulos.
export const Subtitle = ({ className, ...props }: SubtitleProps) => {
  return (
    <p
      className={cn('text-base font-semibold text-subtitle/90', className)}
      data-slot="subtitle"
      {...props}
    />
  );
};
