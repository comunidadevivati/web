import { getLocalizedPageTitle } from '@/app/router/page-title';
import { FormEditView } from '@/features/forms/presentation/views/form-edit.view';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_authenticated/departamentos/lideranca/formularios/$formId/',
)({
  head: () => ({
    meta: [{ title: getLocalizedPageTitle('form') }],
  }),
  component: FormEditView,
});
