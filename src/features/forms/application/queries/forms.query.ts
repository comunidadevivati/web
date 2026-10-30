import { getFormReportUseCase } from '@/features/forms/application/use-cases/get-form-report.use-case';
import { getFormUseCase } from '@/features/forms/application/use-cases/get-form.use-case';
import { getFormsSummaryUseCase } from '@/features/forms/application/use-cases/get-forms-summary.use-case';
import { listEmailGroupsUseCase } from '@/features/forms/application/use-cases/list-email-groups.use-case';
import { listFormInvitationsUseCase } from '@/features/forms/application/use-cases/list-form-invitations.use-case';
import { listFormsUseCase } from '@/features/forms/application/use-cases/list-forms.use-case';
import type { FormStatus } from '@/features/forms/domain/form';
import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';

// Raiz das chaves dos formulários: invalidada após qualquer alteração.
export const FORMS_QUERY_KEY = ['forms'] as const;

export const formsQueryOptions = (department: string, status: FormStatus | null) => {
  return infiniteQueryOptions({
    queryKey: [...FORMS_QUERY_KEY, 'list', department, status],
    queryFn: ({ pageParam }) => listFormsUseCase({ department, status, cursor: pageParam }),
    initialPageParam: null as string | null,
    getNextPageParam: ({ nextCursor }) => nextCursor,
  });
};

export const formsSummaryQueryOptions = (department: string) => {
  return queryOptions({
    queryKey: [...FORMS_QUERY_KEY, 'summary', department],
    queryFn: () => getFormsSummaryUseCase(department),
  });
};

export const formQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: [...FORMS_QUERY_KEY, 'form', id],
    queryFn: () => getFormUseCase(id),
  });
};

export const emailGroupsQueryOptions = () => {
  return queryOptions({
    queryKey: ['email-groups'],
    queryFn: () => listEmailGroupsUseCase(),
    staleTime: 5 * 60 * 1000,
  });
};

export const formInvitationsQueryOptions = (formId: string) => {
  return queryOptions({
    queryKey: [...FORMS_QUERY_KEY, 'invitations', formId],
    queryFn: () => listFormInvitationsUseCase(formId),
  });
};

// Formulários que podem servir de modelo para um novo (os 100 mais recentes, de qualquer status).
export const formTemplatesQueryOptions = (department: string) => {
  return queryOptions({
    queryKey: [...FORMS_QUERY_KEY, 'templates', department],
    queryFn: async () =>
      (await listFormsUseCase({ department, status: null, cursor: null, limit: 100 })).items,
  });
};

export const formReportQueryOptions = (formId: string) => {
  return queryOptions({
    queryKey: [...FORMS_QUERY_KEY, 'report', formId],
    queryFn: () => getFormReportUseCase(formId),
  });
};
