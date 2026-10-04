import { cn } from '@/lib/utils';
import type { ComponentProps } from 'react';

type TextProps = ComponentProps<'p'>;

export const Text = ({ className, ...props }: TextProps) => {
  return <p className={cn('text-sm text-muted-foreground', className)} {...props} />;
};
