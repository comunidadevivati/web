import { fieldControlClassName } from '@/components/ui/field-control';
import { cn } from 'cn';
import type { ComponentProps } from 'react';

type TextareaProps = ComponentProps<'textarea'>;

// Campo de texto de várias linhas, com o mesmo visual dos demais controles de formulário.
export const Textarea = ({ className, ...props }: TextareaProps) => {
  return (
    <textarea
      className={cn(fieldControlClassName, 'h-auto min-h-24 resize-y py-2', className)}
      data-slot="textarea"
      {...props}
    />
  );
};
