import { Input } from '@/components/ui';
import type { ChangeEvent, ComponentProps } from 'react';

type MaskedInputProps = ComponentProps<'input'> & {
  // Aplica a máscara ao texto digitado (ex.: formatCnpj, formatPostalCode).
  format: (value: string) => string;
};

// Campo com máscara compatível com o register do React Hook Form: o valor já chega mascarado.
export const MaskedInput = ({ format, onChange, ...props }: MaskedInputProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.target.value = format(event.target.value);

    onChange?.(event);
  };

  return <Input inputMode="numeric" type="text" onChange={handleChange} {...props} />;
};
