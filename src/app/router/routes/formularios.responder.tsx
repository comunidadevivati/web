import { getLocalizedPageTitle } from '@/app/router/page-title';
import { formAnswerSearchSchema } from '@/features/forms/presentation/models/form-answer.model';
import { FormAnswerView } from '@/features/forms/presentation/views/form-answer.view';
import { createFileRoute } from '@tanstack/react-router';

// Pública: o link pessoal do e-mail é a credencial (sem login).
export const Route = createFileRoute('/formularios/responder')({
  head: () => ({
    meta: [
      { title: getLocalizedPageTitle('formAnswer') },
      { name: 'referrer', content: 'no-referrer' },
    ],
  }),
  validateSearch: formAnswerSearchSchema,
  component: FormAnswerView,
});
