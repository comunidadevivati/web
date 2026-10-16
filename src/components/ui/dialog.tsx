import { Button } from '@/components/ui/button';
import { Subtitle } from '@/components/ui/subtitle';
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import { cn } from 'cn';
import { XIcon } from 'lucide-react';
import type { ComponentProps } from 'react';

export const Dialog = ({ ...props }: DialogPrimitive.Root.Props) => {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
};

export const DialogTrigger = ({ ...props }: DialogPrimitive.Trigger.Props) => {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
};

export const DialogPortal = ({ ...props }: DialogPrimitive.Portal.Props) => {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
};

export const DialogClose = ({ ...props }: DialogPrimitive.Close.Props) => {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
};

export const DialogOverlay = ({ className, ...props }: DialogPrimitive.Backdrop.Props) => {
  return (
    <DialogPrimitive.Backdrop
      className={cn(
        `
          fixed inset-0 isolate z-50 bg-overlay/40 duration-100
          supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0
          data-closed:animate-out data-closed:fade-out-0
        `,
        className,
      )}
      data-slot="dialog-overlay"
      {...props}
    />
  );
};

type DialogContentProps = DialogPrimitive.Popup.Props & {
  // Nome acessível do botão de fechar (traduzido por quem usa). Sem ele, o botão não é exibido.
  closeLabel?: string;
  closeDisabled?: boolean;
};

export const DialogContent = ({
  className,
  children,
  closeDisabled,
  closeLabel,
  ...props
}: DialogContentProps) => {
  return (
    <DialogPortal>
      <DialogOverlay />

      <DialogPrimitive.Popup
        className={cn(
          `
            fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2
            -translate-y-1/2 gap-4 rounded-xl bg-popover p-4 text-sm text-popover-foreground ring-1
            ring-foreground/10 duration-100 outline-none sm:max-w-sm data-open:animate-in
            data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0
            data-closed:zoom-out-95
          `,
          className,
        )}
        data-slot="dialog-content"
        {...props}
      >
        {children}

        {closeLabel && (
          <DialogPrimitive.Close
            aria-label={closeLabel}
            data-slot="dialog-close"
            disabled={closeDisabled}
            render={<Button className="absolute top-2 right-2" size="icon-sm" variant="ghost" />}
          >
            <XIcon />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </DialogPortal>
  );
};

export const DialogHeader = ({ className, ...props }: ComponentProps<'div'>) => {
  return (
    <div className={cn('flex flex-col gap-2', className)} data-slot="dialog-header" {...props} />
  );
};

export const DialogFooter = ({ className, ...props }: ComponentProps<'div'>) => {
  return (
    <div
      className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
      data-slot="dialog-footer"
      {...props}
    />
  );
};

export const DialogTitle = ({ className, ...props }: DialogPrimitive.Title.Props) => {
  return (
    <DialogPrimitive.Title
      className={cn('font-heading text-base leading-none font-medium', className)}
      data-slot="dialog-title"
      {...props}
    />
  );
};

// A descrição do modal segue o padrão de subtítulo (componente Subtitle), mantendo o vínculo
// acessível com o modal (aria-describedby) feito pelo Base UI.
export const DialogDescription = ({ className, ...props }: DialogPrimitive.Description.Props) => {
  return (
    <DialogPrimitive.Description
      className={cn('*:[a]:underline *:[a]:underline-offset-3', className)}
      data-slot="dialog-description"
      render={<Subtitle />}
      {...props}
    />
  );
};
