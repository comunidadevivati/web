import { toggleVariants } from '@/components/ui/toggle';
import { Toggle as TogglePrimitive } from '@base-ui/react/toggle';
import { ToggleGroup as ToggleGroupPrimitive } from '@base-ui/react/toggle-group';
import type { VariantProps } from 'class-variance-authority';
import { cn } from 'cn';
import { createContext, useContext, type CSSProperties } from 'react';

type ToggleGroupContextValue = VariantProps<typeof toggleVariants> & {
  spacing?: number;
  orientation?: 'horizontal' | 'vertical';
};

const ToggleGroupContext = createContext<ToggleGroupContextValue>({
  size: 'default',
  variant: 'default',
  spacing: 2,
  orientation: 'horizontal',
});

type ToggleGroupProps = ToggleGroupPrimitive.Props & ToggleGroupContextValue;

export const ToggleGroup = ({
  className,
  variant,
  size,
  spacing = 2,
  orientation = 'horizontal',
  children,
  ...props
}: ToggleGroupProps) => {
  return (
    <ToggleGroupPrimitive
      className={cn(
        `
          group/toggle-group flex w-fit flex-row items-center gap-[--spacing(var(--gap))] rounded-lg
          data-[size=sm]:rounded-[min(var(--radius-md),10px)] data-vertical:flex-col
          data-vertical:items-stretch
        `,
        className,
      )}
      data-orientation={orientation}
      data-size={size}
      data-slot="toggle-group"
      data-spacing={spacing}
      data-variant={variant}
      orientation={orientation}
      style={{ '--gap': spacing } as CSSProperties}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size, spacing, orientation }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive>
  );
};

type ToggleGroupItemProps = TogglePrimitive.Props & VariantProps<typeof toggleVariants>;

export const ToggleGroupItem = ({
  className,
  children,
  variant = 'default',
  size = 'default',
  ...props
}: ToggleGroupItemProps) => {
  const context = useContext(ToggleGroupContext);

  return (
    <TogglePrimitive
      className={cn(
        `
          shrink-0 group-data-[spacing=0]/toggle-group:rounded-none
          group-data-[spacing=0]/toggle-group:px-2 focus:z-10 focus-visible:z-10
          group-data-[spacing=0]/toggle-group:has-data-[icon=inline-end]:pr-1.5
          group-data-[spacing=0]/toggle-group:has-data-[icon=inline-start]:pl-1.5
          group-data-horizontal/toggle-group:data-[spacing=0]:first:rounded-l-lg
          group-data-vertical/toggle-group:data-[spacing=0]:first:rounded-t-lg
          group-data-horizontal/toggle-group:data-[spacing=0]:last:rounded-r-lg
          group-data-vertical/toggle-group:data-[spacing=0]:last:rounded-b-lg
          group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:border-l-0
          group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:border-t-0
          group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-l
          group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-t
        `,
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        className,
      )}
      data-size={context.size || size}
      data-slot="toggle-group-item"
      data-spacing={context.spacing}
      data-variant={context.variant || variant}
      {...props}
    >
      {children}
    </TogglePrimitive>
  );
};
