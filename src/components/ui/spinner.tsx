import { cn } from 'cn';
import { Loader2Icon } from 'lucide-react';
import type { ComponentProps } from 'react';

type SpinnerProps = ComponentProps<'svg'>;

export const Spinner = ({ className, ...props }: SpinnerProps) => {
  return (
    <Loader2Icon
      aria-label="Carregando"
      className={cn('size-4 animate-spin', className)}
      data-slot="spinner"
      role="status"
      {...props}
    />
  );
};
