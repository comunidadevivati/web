import type { ComponentProps } from 'react';

type ImageProps = ComponentProps<'img'>;

export const Image = (props: ImageProps) => {
  return <img {...props} />;
};
