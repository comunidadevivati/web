import type { ComponentProps } from 'react';

type AnchorProps = ComponentProps<'a'> & {
  isExternal?: boolean;
};

export const Anchor = ({ isExternal = false, rel, target, ...props }: AnchorProps) => {
  return (
    <a
      rel={isExternal ? 'noopener noreferrer' : rel}
      target={isExternal ? '_blank' : target}
      {...props}
    />
  );
};
