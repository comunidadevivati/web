import type { ComponentProps } from 'react';

type FormProps = ComponentProps<'form'>;

export const Form = (props: FormProps) => {
  return <form {...props} />;
};
