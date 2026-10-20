import { getLocalizedPageTitle } from '@/app/router/page-title';
import { AlbumsView } from '@/features/gallery/presentation/views/albums.view';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/site/albuns/')({
  head: () => ({
    meta: [{ title: getLocalizedPageTitle('albums') }],
  }),
  component: AlbumsView,
});
