import { Button } from '@/components/ui/button';
import { fieldGroupClassName } from '@/components/ui/field-control';
import { Input } from '@/components/ui/input';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from 'cn';
import type { ComponentProps, MouseEvent } from 'react';

export const InputGroup = ({ className, ...props }: ComponentProps<'div'>) => {
  return (
    <div
      className={cn(
        fieldGroupClassName,
        `
          group/input-group relative flex items-center
          in-data-[slot=combobox-content]:focus-within:border-inherit
          in-data-[slot=combobox-content]:focus-within:ring-0 has-[>[data-align=block-end]]:h-auto
          has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:h-auto
          has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-3
          has-[>[data-align=block-start]]:[&>input]:pb-3
          has-[>[data-align=inline-end]]:[&>input]:pr-1.5
          has-[>[data-align=inline-start]]:[&>input]:pl-1.5
        `,
        className,
      )}
      data-slot="input-group"
      role="group"
      {...props}
    />
  );
};

const inputGroupAddonVariants = cva(
  `
    flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-sm font-medium
    text-foreground select-none group-data-[disabled=true]/input-group:opacity-50
    [&>kbd]:rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-4
  `,
  {
    variants: {
      align: {
        'inline-start': 'order-first pl-2 has-[>button]:-ml-1.25 has-[>kbd]:ml-[-0.15rem]',
        'inline-end': 'order-last pr-2 has-[>button]:-mr-1.25 has-[>kbd]:mr-[-0.15rem]',
        'block-start': `
          order-first w-full justify-start px-2.5 pt-2 group-has-[>input]/input-group:pt-2
          [.border-b]:pb-2
        `,
        'block-end': `
          order-last w-full justify-start px-2.5 pb-2 group-has-[>input]/input-group:pb-2
          [.border-t]:pt-2
        `,
      },
    },
    defaultVariants: {
      align: 'inline-start',
    },
  },
);

type InputGroupAddonProps = ComponentProps<'div'> & VariantProps<typeof inputGroupAddonVariants>;

// Clicar no complemento (fora de um botão) leva o foco ao campo do grupo.
const focusGroupInput = (event: MouseEvent<HTMLDivElement>) => {
  if ((event.target as HTMLElement).closest('button')) {
    return;
  }

  event.currentTarget.parentElement?.querySelector('input')?.focus();
};

export const InputGroupAddon = ({
  className,
  align = 'inline-start',
  ...props
}: InputGroupAddonProps) => {
  return (
    <div
      className={cn(inputGroupAddonVariants({ align }), className)}
      data-align={align}
      data-slot="input-group-addon"
      role="group"
      onClick={focusGroupInput}
      {...props}
    />
  );
};

const inputGroupButtonVariants = cva('flex items-center gap-2 text-sm shadow-none', {
  variants: {
    size: {
      xs: `
        h-6 gap-1 rounded-[calc(var(--radius)-3px)] px-1.5 [&>svg:not([class*='size-'])]:size-3.5
      `,
      sm: '',
      'icon-xs': 'size-6 rounded-[calc(var(--radius)-3px)] p-0 has-[>svg]:p-0',
      'icon-sm': 'size-8 p-0 has-[>svg]:p-0',
    },
  },
  defaultVariants: {
    size: 'xs',
  },
});

type InputGroupButtonProps = Omit<ComponentProps<typeof Button>, 'size' | 'type'> &
  VariantProps<typeof inputGroupButtonVariants> & {
    type?: 'button' | 'submit' | 'reset';
  };

export const InputGroupButton = ({
  className,
  type = 'button',
  variant = 'ghost',
  size = 'xs',
  ...props
}: InputGroupButtonProps) => {
  return (
    <Button
      className={cn(inputGroupButtonVariants({ size }), className)}
      data-size={size}
      type={type}
      variant={variant}
      {...props}
    />
  );
};

export const InputGroupText = ({ className, ...props }: ComponentProps<'span'>) => {
  return (
    <span
      className={cn(
        `
          flex items-center gap-2 text-sm text-muted-foreground [&_svg]:pointer-events-none
          [&_svg:not([class*='size-'])]:size-4
        `,
        className,
      )}
      {...props}
    />
  );
};

export const InputGroupInput = ({ className, ...props }: ComponentProps<'input'>) => {
  return (
    <Input
      className={cn(
        `
          h-full flex-1 rounded-none border-0 bg-transparent shadow-none ring-0 focus-visible:ring-0
          disabled:bg-transparent disabled:opacity-100 aria-invalid:ring-0
          dark:disabled:bg-transparent dark:aria-invalid:ring-0
        `,
        className,
      )}
      data-slot="input-group-control"
      {...props}
    />
  );
};
