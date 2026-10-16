import { Button } from '@/components/ui/button';
import { Toast as ToastPrimitive } from '@base-ui/react/toast';
import { cn } from 'cn';
import { XIcon } from 'lucide-react';

export const useToastManager = ToastPrimitive.useToastManager;

export const ToastProvider = ({ ...props }: ToastPrimitive.Provider.Props) => {
  return <ToastPrimitive.Provider {...props} />;
};

export const ToastPortal = ({ ...props }: ToastPrimitive.Portal.Props) => {
  return <ToastPrimitive.Portal data-slot="toast-portal" {...props} />;
};

// Pilha de toasts: no topo, largura total no celular e à direita a partir de sm.
export const ToastViewport = ({ className, ...props }: ToastPrimitive.Viewport.Props) => {
  return (
    <ToastPrimitive.Viewport
      className={cn(
        `
          pointer-events-none fixed inset-x-4 top-4 z-100 flex flex-col gap-3 outline-none
          sm:right-6 sm:left-auto sm:w-full sm:max-w-sm
        `,
        className,
      )}
      data-slot="toast-viewport"
      {...props}
    />
  );
};

export const Toast = ({ className, ...props }: ToastPrimitive.Root.Props) => {
  return (
    <ToastPrimitive.Root
      className={cn(
        `
          group/toast pointer-events-auto relative w-full overflow-hidden rounded-xl border
          border-border bg-popover text-popover-foreground shadow-elevated-lg transition-all
          duration-300 ease-out select-none [transform:translateX(var(--toast-swipe-movement-x))]
          data-ending-style:translate-x-full data-ending-style:opacity-0
          data-starting-style:-translate-y-4 data-starting-style:opacity-0
        `,
        className,
      )}
      data-slot="toast"
      {...props}
    />
  );
};

export const ToastContent = ({ className, ...props }: ToastPrimitive.Content.Props) => {
  return (
    <ToastPrimitive.Content
      className={cn('grid gap-3 p-4', className)}
      data-slot="toast-content"
      {...props}
    />
  );
};

export const ToastTitle = ({ className, ...props }: ToastPrimitive.Title.Props) => {
  return (
    <ToastPrimitive.Title
      className={cn('text-base leading-snug font-semibold', className)}
      data-slot="toast-title"
      {...props}
    />
  );
};

export const ToastDescription = ({ className, ...props }: ToastPrimitive.Description.Props) => {
  return (
    <ToastPrimitive.Description
      className={cn('text-sm leading-snug text-foreground/85', className)}
      data-slot="toast-description"
      {...props}
    />
  );
};

type ToastCloseProps = ToastPrimitive.Close.Props & {
  // Nome acessível do botão (traduzido por quem usa).
  label: string;
};

export const ToastClose = ({ className, label, ...props }: ToastCloseProps) => {
  return (
    <ToastPrimitive.Close
      aria-label={label}
      className={cn('-mt-1 -mr-1 shrink-0', className)}
      data-slot="toast-close"
      render={<Button size="icon" variant="ghost" />}
      {...props}
    >
      <XIcon aria-hidden="true" />
    </ToastPrimitive.Close>
  );
};
