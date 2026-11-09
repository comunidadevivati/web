import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from 'cn';

/*
 * Botão único da aplicação. Toda cor vem de tokens semânticos, nunca de classes próprias.
 *
 * Hierarquia (uma ação principal por contexto):
 * - primary: a ação principal da tela ou do formulário;
 * - secondary: ação de apoio que ainda precisa de destaque;
 * - tertiary: ação de menor destaque, com fundo neutro;
 * - outline: alternativa neutra à ação principal (ex.: Cancelar);
 * - ghost: ações discretas em barras, menus e botões só com ícone;
 * - destructive: ações que apagam ou desfazem;
 * - link: ação com aparência de link.
 *
 * Tamanhos: xs < sm < default < lg, e as versões icon-* para botões só com ícone.
 */
export const buttonVariants = cva(
  `
    group/button inline-flex shrink-0 cursor-pointer items-center justify-center rounded-lg border
    border-transparent bg-clip-padding font-semibold whitespace-nowrap transition-all outline-none
    select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50
    not-data-disabled:active:not-aria-[haspopup]:translate-y-px data-disabled:cursor-not-allowed
    data-disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3
    aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50
    dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0
  `,
  {
    variants: {
      variant: {
        primary: `
          bg-primary text-primary-foreground shadow-xs not-data-disabled:hover:bg-primary/85
          aria-expanded:bg-primary/85
        `,
        secondary: `
          bg-secondary text-secondary-foreground shadow-xs
          not-data-disabled:hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_8%)]
          aria-expanded:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_8%)]
        `,
        tertiary: `
          bg-tertiary text-tertiary-foreground shadow-xs
          not-data-disabled:hover:bg-[color-mix(in_oklch,var(--tertiary),var(--foreground)_8%)]
          aria-expanded:bg-[color-mix(in_oklch,var(--tertiary),var(--foreground)_8%)]
        `,
        outline: `
          border-border bg-background not-data-disabled:hover:bg-muted
          not-data-disabled:hover:text-foreground aria-expanded:bg-muted
          aria-expanded:text-foreground dark:border-input dark:bg-input/30
          dark:not-data-disabled:hover:bg-input/50
        `,
        ghost: `
          not-data-disabled:hover:bg-muted not-data-disabled:hover:text-foreground
          aria-expanded:bg-muted aria-expanded:text-foreground
        `,
        destructive: `
          bg-destructive/10 text-destructive not-data-disabled:hover:bg-destructive/20
          focus-visible:border-destructive/40 focus-visible:ring-destructive/20
          dark:bg-destructive/20 dark:not-data-disabled:hover:bg-destructive/30
          dark:focus-visible:ring-destructive/40
        `,
        link: 'text-primary underline-offset-4 not-data-disabled:hover:underline',
      },
      size: {
        xs: `
          h-8 gap-1 px-2.5 text-xs has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2
          [&_svg:not([class*='size-'])]:size-3.5
        `,
        sm: `
          h-9 gap-1.5 px-3 text-sm has-data-[icon=inline-end]:pr-2.5
          has-data-[icon=inline-start]:pl-2.5 [&_svg:not([class*='size-'])]:size-4
        `,
        default: `
          h-11 gap-2 px-4 text-sm has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3
          [&_svg:not([class*='size-'])]:size-4
        `,
        lg: `
          h-12 gap-2 px-6 text-base has-data-[icon=inline-end]:pr-5
          has-data-[icon=inline-start]:pl-5 [&_svg:not([class*='size-'])]:size-5
        `,
        'icon-xs': "size-8 [&_svg:not([class*='size-'])]:size-3.5",
        'icon-sm': "size-9 [&_svg:not([class*='size-'])]:size-4",
        icon: "size-10 [&_svg:not([class*='size-'])]:size-4",
        'icon-lg': "size-11 [&_svg:not([class*='size-'])]:size-5",
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
);

type ButtonProps = ButtonPrimitive.Props & VariantProps<typeof buttonVariants>;

export const Button = ({ className, size, variant, ...props }: ButtonProps) => {
  return (
    <ButtonPrimitive
      className={cn(buttonVariants({ variant, size, className }))}
      data-slot="button"
      {...props}
    />
  );
};
