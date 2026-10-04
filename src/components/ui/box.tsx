import type { ComponentProps } from 'react';

type BoxProps = ComponentProps<'div'>;

export const Box = (props: BoxProps) => {
  return <div {...props} />;
};
