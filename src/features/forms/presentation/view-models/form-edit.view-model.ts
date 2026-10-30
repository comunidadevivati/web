import { formQueryOptions } from '@/features/forms/application/queries/forms.query';
import { isSendingEmails } from '@/features/forms/domain/form';
import { getFormsNotice } from '@/features/forms/presentation/models/forms.model';
import { useQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';

export const useFormEditViewModel = () => {
  const { formId } = useParams({
    from: '/_authenticated/departamentos/lideranca/formularios/$formId/',
  });

  const {
    data: form,
    error,
    isFetching,
    isPending,
    refetch,
  } = useQuery({
    ...formQueryOptions(formId),
    // Com envio de e-mails em andamento, relê até o desbloqueio.
    refetchInterval: ({ state }) => (state.data && isSendingEmails(state.data) ? 3000 : false),
  });

  const retry = () => {
    void refetch();
  };

  return {
    errorNotice: error && !form ? getFormsNotice(error) : null,
    form,
    isLoading: isPending,
    isRetrying: isFetching,
    retry,
  };
};
