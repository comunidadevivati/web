import { getLocalizedPageTitle } from '@/app/router/page-title';
import { FormsView } from '@/features/forms/presentation/views/forms.view';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/departamentos/lideranca/formularios/')({
  head: () => ({
    meta: [{ title: getLocalizedPageTitle('forms') }],
  }),
  component: FormsView,
});
