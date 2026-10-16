import { Input } from '@/components/ui';
import { formatPhone } from '@/shared/validation/brazilian-phone';
import type { ChangeEvent, ComponentProps } from 'react';

type PhoneInputProps = Omit<ComponentProps<'input'>, 'type'>;

// Campo de telefone brasileiro com DDD e máscara: (67) 3333-4444 ou (67) 99999-8888.
// Funciona com o register do React Hook Form: o valor já chega mascarado ao onChange.
export const PhoneInput = ({ onChange, ...props }: PhoneInputProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.target.value = formatPhone(event.target.value);

    onChange?.(event);
  };

  return (
    <Input
      autoComplete="tel-national"
      inputMode="tel"
      maxLength={15}
      type="tel"
      onChange={handleChange}
      {...props}
    />
  );
};
