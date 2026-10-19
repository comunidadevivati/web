import { fieldControlClassName } from '@/components/ui/field-control';
import { Select as SelectPrimitive } from '@base-ui/react/select';
import { cn } from 'cn';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import type { ComponentProps } from 'react';

export const Select = SelectPrimitive.Root;

type SelectGroupProps = SelectPrimitive.Group.Props;

export const SelectGroup = ({ className, ...props }: SelectGroupProps) => {
  return (
    <SelectPrimitive.Group
      className={cn('scroll-my-1 p-1', className)}
      data-slot="select-group"
      {...props}
    />
  );
};

type SelectValueProps = SelectPrimitive.Value.Props;

export const SelectValue = ({ className, ...props }: SelectValueProps) => {
  return (
    <SelectPrimitive.Value
      className={cn('flex flex-1 text-left', className)}
      data-slot="select-value"
      {...props}
    />
  );
};

type SelectTriggerProps = SelectPrimitive.Trigger.Props;

// Mesma aparência dos demais campos (fieldControlClassName): altura, borda, fundo, foco e estados.
export const SelectTrigger = ({ children, className, ...props }: SelectTriggerProps) => {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        fieldControlClassName,
        `
          flex items-center justify-between gap-1.5 pr-2 text-left whitespace-nowrap select-none
          data-placeholder:text-placeholder/80 *:data-[slot=select-value]:line-clamp-1
          [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4
        `,
        className,
      )}
      data-slot="select-trigger"
      {...props}
    >
      {children}

      <SelectPrimitive.Icon
        render={<ChevronDownIcon className="pointer-events-none size-4 text-muted-foreground" />}
      />
    </SelectPrimitive.Trigger>
  );
};

type SelectScrollButtonProps = ComponentProps<typeof SelectPrimitive.ScrollUpArrow>;

const scrollButtonClassName = cn(`
  z-10 flex w-full cursor-default items-center justify-center bg-popover py-1
  [&_svg:not([class*='size-'])]:size-4
`);

export const SelectScrollUpButton = ({ className, ...props }: SelectScrollButtonProps) => {
  return (
    <SelectPrimitive.ScrollUpArrow
      className={cn(scrollButtonClassName, 'top-0', className)}
      data-slot="select-scroll-up-button"
      {...props}
    >
      <ChevronUpIcon />
    </SelectPrimitive.ScrollUpArrow>
  );
};

export const SelectScrollDownButton = ({ className, ...props }: SelectScrollButtonProps) => {
  return (
    <SelectPrimitive.ScrollDownArrow
      className={cn(scrollButtonClassName, 'bottom-0', className)}
      data-slot="select-scroll-down-button"
      {...props}
    >
      <ChevronDownIcon />
    </SelectPrimitive.ScrollDownArrow>
  );
};

type SelectContentProps = SelectPrimitive.Popup.Props &
  Pick<
    SelectPrimitive.Positioner.Props,
    'align' | 'alignOffset' | 'side' | 'sideOffset' | 'alignItemWithTrigger'
  >;

export const SelectContent = ({
  align = 'center',
  alignItemWithTrigger = true,
  alignOffset = 0,
  children,
  className,
  side = 'bottom',
  sideOffset = 4,
  ...props
}: SelectContentProps) => {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        align={align}
        alignItemWithTrigger={alignItemWithTrigger}
        alignOffset={alignOffset}
        className="isolate z-50"
        side={side}
        sideOffset={sideOffset}
      >
        <SelectPrimitive.Popup
          className={cn(
            `
              relative isolate z-50 max-h-(--available-height) w-(--anchor-width) min-w-36
              origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-popover
              text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100
              data-[align-trigger=true]:animate-none data-[side=bottom]:slide-in-from-top-2
              data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0
              data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0
              data-closed:zoom-out-95
            `,
            className,
          )}
          data-align-trigger={alignItemWithTrigger}
          data-slot="select-content"
          {...props}
        >
          <SelectScrollUpButton />

          <SelectPrimitive.List>{children}</SelectPrimitive.List>

          <SelectScrollDownButton />
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  );
};

type SelectLabelProps = SelectPrimitive.GroupLabel.Props;

export const SelectLabel = ({ className, ...props }: SelectLabelProps) => {
  return (
    <SelectPrimitive.GroupLabel
      className={cn('px-1.5 py-1 text-xs text-muted-foreground', className)}
      data-slot="select-label"
      {...props}
    />
  );
};

type SelectItemProps = SelectPrimitive.Item.Props;

const itemIndicatorClassName = cn(
  'absolute right-2 flex size-4 items-center justify-center',
  `pointer-events-none`,
);

// Alvo de toque de 40px no celular (min-h-10), reduzido a partir de sm.
export const SelectItem = ({ children, className, ...props }: SelectItemProps) => {
  return (
    <SelectPrimitive.Item
      className={cn(
        `
          relative flex min-h-10 w-full cursor-default items-center gap-1.5 rounded-md py-1 pr-8
          pl-2 text-sm outline-hidden select-none focus:bg-muted focus:text-foreground
          data-disabled:pointer-events-none data-disabled:opacity-50 sm:min-h-8
          [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4
        `,
        className,
      )}
      data-slot="select-item"
      {...props}
    >
      <SelectPrimitive.ItemText className="flex flex-1 shrink-0 gap-2 whitespace-nowrap">
        {children}
      </SelectPrimitive.ItemText>

      <SelectPrimitive.ItemIndicator render={<span className={itemIndicatorClassName} />}>
        <CheckIcon className="pointer-events-none" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
};

type SelectSeparatorProps = SelectPrimitive.Separator.Props;

export const SelectSeparator = ({ className, ...props }: SelectSeparatorProps) => {
  return (
    <SelectPrimitive.Separator
      className={cn('pointer-events-none -mx-1 my-1 h-px bg-border', className)}
      data-slot="select-separator"
      {...props}
    />
  );
};
