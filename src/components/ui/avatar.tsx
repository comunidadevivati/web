import { Avatar as AvatarPrimitive } from '@base-ui/react/avatar';
import { cn } from 'cn';
import type { ComponentProps } from 'react';

type AvatarProps = AvatarPrimitive.Root.Props & {
  size?: 'default' | 'sm' | 'lg';
};

export const Avatar = ({ className, size = 'default', ...props }: AvatarProps) => {
  return (
    <AvatarPrimitive.Root
      className={cn(
        `
          group/avatar relative flex size-8 shrink-0 rounded-full select-none after:absolute
          after:inset-0 after:rounded-full after:border after:border-border after:mix-blend-darken
          data-[size=lg]:size-10 data-[size=sm]:size-6 dark:after:mix-blend-lighten
        `,
        className,
      )}
      data-size={size}
      data-slot="avatar"
      {...props}
    />
  );
};

export const AvatarImage = ({ className, ...props }: AvatarPrimitive.Image.Props) => {
  return (
    <AvatarPrimitive.Image
      className={cn('aspect-square size-full rounded-full object-cover', className)}
      data-slot="avatar-image"
      {...props}
    />
  );
};

export const AvatarFallback = ({ className, ...props }: AvatarPrimitive.Fallback.Props) => {
  return (
    <AvatarPrimitive.Fallback
      className={cn(
        `
          flex size-full items-center justify-center rounded-full bg-muted text-sm
          text-muted-foreground group-data-[size=sm]/avatar:text-xs
        `,
        className,
      )}
      data-slot="avatar-fallback"
      {...props}
    />
  );
};

export const AvatarBadge = ({ className, ...props }: ComponentProps<'span'>) => {
  return (
    <span
      className={cn(
        `
          absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full
          bg-primary text-primary-foreground bg-blend-color ring-2 ring-background select-none
        `,
        'group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden',
        'group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2',
        'group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2',
        className,
      )}
      data-slot="avatar-badge"
      {...props}
    />
  );
};
