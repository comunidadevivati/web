import { cn } from '@/lib/utils';
import type { ComponentProps } from 'react';

type CheckboxProps = Omit<ComponentProps<'input'>, 'type'>;

export const Checkbox = ({ className, ...props }: CheckboxProps) => {
  return (
    <input
      className={cn(
        `
          size-5 shrink-0 cursor-pointer rounded accent-primary focus-visible:ring-3
          focus-visible:ring-ring/50 focus-visible:outline-none disabled:cursor-not-allowed
          disabled:opacity-50
        `,
        className,
      )}
      data-slot="checkbox"
      type="checkbox"
      {...props}
    />
  );
};
