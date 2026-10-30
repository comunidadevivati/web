import { cn } from '@/lib/utils';
import type { ComponentProps } from 'react';

type RadioProps = Omit<ComponentProps<'input'>, 'type'>;

// Botão de opção única: radios com o mesmo name formam um grupo em que só um fica marcado.
export const Radio = ({ className, ...props }: RadioProps) => {
  return (
    <input
      className={cn(
        `
          size-5 shrink-0 cursor-pointer accent-primary focus-visible:ring-3
          focus-visible:ring-ring/50 focus-visible:outline-none disabled:cursor-not-allowed
          disabled:opacity-50
        `,
        className,
      )}
      data-slot="radio"
      type="radio"
      {...props}
    />
  );
};
