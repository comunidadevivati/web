import { getLocalizedPageTitle } from '@/app/router/page-title';
import { FormReportView } from '@/features/forms/presentation/views/form-report.view';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_authenticated/departamentos/lideranca/formularios/$formId/relatorio',
)({
  head: () => ({
    meta: [{ title: getLocalizedPageTitle('formReport') }],
  }),
  component: FormReportView,
});
