import { useFormState, type Control, type FieldValues } from 'react-hook-form';

// Regra da aplicação: formulário inválido não pode ser enviado, inclusive quando ainda não foi
// tocado (campo obrigatório vazio já é erro de validação), mesmo sem mensagem exibida na tela.
export const useHasValidationErrors = <
  TFieldValues extends FieldValues,
  TContext,
  TTransformedValues,
>(
  control: Control<TFieldValues, TContext, TTransformedValues>,
) => {
  const { isValid } = useFormState({ control });

  return !isValid;
};
