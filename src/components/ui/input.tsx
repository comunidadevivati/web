import { fieldControlClassName } from '@/components/ui/field-control';
import { Input as InputPrimitive } from '@base-ui/react/input';
import { cn } from 'cn';
import type { ComponentProps } from 'react';

type InputProps = ComponentProps<'input'>;

export const Input = ({ className, type, ...props }: InputProps) => {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        fieldControlClassName,
        'file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium',
        'file:text-foreground',
        className,
      )}
      {...props}
    />
  );
};
