import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentPropsWithoutRef } from 'react';

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

const headingVariants = cva('', {
  variants: {
    level: {
      1: 'text-4xl font-bold tracking-tight',
      2: 'text-3xl font-semibold tracking-tight',
      3: 'text-2xl font-semibold tracking-tight',
      4: 'text-xl font-semibold',
      5: 'text-lg font-semibold',
      6: 'text-base font-semibold',
    },
  },
  defaultVariants: {
    level: 1,
  },
});

const headingElements = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
  5: 'h5',
  6: 'h6',
} as const satisfies Record<HeadingLevel, HeadingTag>;

type HeadingVariantProps = Omit<VariantProps<typeof headingVariants>, 'level'>;

type HeadingProps = ComponentPropsWithoutRef<'h1'> &
  HeadingVariantProps & {
    level?: HeadingLevel;
  };

export const Heading = ({ level = 1, className, ...props }: HeadingProps) => {
  const Component = headingElements[level];

  return <Component className={cn(headingVariants({ level }), className)} {...props} />;
};
