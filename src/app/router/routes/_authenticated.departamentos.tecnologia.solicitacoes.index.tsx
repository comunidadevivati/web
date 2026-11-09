import { getLocalizedPageTitle } from '@/app/router/page-title';
import { BacklogBoardView } from '@/features/backlog/presentation/views/backlog-board.view';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/departamentos/tecnologia/solicitacoes/')({
  head: () => ({
    meta: [{ title: getLocalizedPageTitle('technologyRequests') }],
  }),
  component: BacklogBoardView,
});
