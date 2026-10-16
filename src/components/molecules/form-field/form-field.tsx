import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui';
import type { ReactNode } from 'react';

type FormFieldProps = {
  // id do controle: associa o rótulo (htmlFor) e identifica a descrição e o erro.
  id: string;
  label: ReactNode;
  // Mensagem de erro já traduzida. Também marca o campo como inválido.
  error?: string;
  description?: ReactNode;
  className?: string;
  children: ReactNode;
};

// Campo de formulário padrão: rótulo, controle, descrição e erro acessível (shadcn Field).
export const FormField = ({
  children,
  className,
  description,
  error,
  id,
  label,
}: FormFieldProps) => {
  return (
    <Field className={className} data-invalid={error ? true : undefined}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>

      {children}

      {description && <FieldDescription id={`${id}-description`}>{description}</FieldDescription>}

      <FieldError id={`${id}-error`}>{error}</FieldError>
    </Field>
  );
};
