import { authSessionQueryOptions } from '@/features/auth/application/queries/auth-session.query';
import { LEADERSHIP_DEPARTMENT } from '@/features/departments/domain/department';
import {
  FORMS_QUERY_KEY,
  formTemplatesQueryOptions,
} from '@/features/forms/application/queries/forms.query';
import { duplicateFormUseCase } from '@/features/forms/application/use-cases/duplicate-form.use-case';
import { getFormsNotice, getServerDetail } from '@/features/forms/presentation/models/forms.model';
import { useGlobalLoading } from '@/shared/feedback/global-loading';
import { notify } from '@/shared/feedback/notify';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

// Novo formulário em branco ou a partir de um existente usado como modelo (cópia não publicada,
// aberta em seguida para edição).
export const useFormCreateViewModel = () => {
  const { t } = useTranslation('forms');

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { data: session } = useQuery(authSessionQueryOptions);

  const { data: templates = [] } = useQuery(formTemplatesQueryOptions(LEADERSHIP_DEPARTMENT));

  const [templateId, setTemplateId] = useState<string | null>(null);

  const { isPending, mutate } = useMutation({
    mutationFn: ({ csrfToken, id }: { csrfToken: string; id: string }) =>
      duplicateFormUseCase({ csrfToken, id }),
    onSuccess: async ({ id, title }) => {
      await queryClient.invalidateQueries({ queryKey: FORMS_QUERY_KEY });

      notify.success({
        title: t('templates.success.title'),
        description: t('templates.success.description', { title }),
      });

      await navigate({
        to: '/departamentos/lideranca/formularios/$formId',
        params: { formId: id },
      });
    },
    onError: (error) => {
      const notice = getFormsNotice(error);

      notify.error({
        title: t(`notices.${notice}.title`),
        description: getServerDetail(error) ?? t(`notices.${notice}.description`),
      });
    },
  });

  useGlobalLoading(isPending);

  const applyTemplate = () => {
    if (templateId && session && !isPending) {
      mutate({ csrfToken: session.csrfToken, id: templateId });
    }
  };

  return {
    changeTemplate: setTemplateId,
    isCopying: isPending,
    templateId,
    templates: templates.map(({ id, status, title }) => ({
      value: id,
      label: `${title} (${t(`status.${status}`)})`,
    })),
    applyTemplate,
  };
};
