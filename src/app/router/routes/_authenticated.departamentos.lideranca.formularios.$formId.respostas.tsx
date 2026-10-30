import { getLocalizedPageTitle } from '@/app/router/page-title';
import { FormResponsesView } from '@/features/forms/presentation/views/form-responses.view';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_authenticated/departamentos/lideranca/formularios/$formId/respostas',
)({
  head: () => ({
    meta: [{ title: getLocalizedPageTitle('formResponses') }],
  }),
  component: FormResponsesView,
});
