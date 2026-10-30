import { getLocalizedPageTitle } from '@/app/router/page-title';
import { FormCreateView } from '@/features/forms/presentation/views/form-create.view';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/departamentos/lideranca/formularios/novo')({
  head: () => ({
    meta: [{ title: getLocalizedPageTitle('newForm') }],
  }),
  component: FormCreateView,
});
