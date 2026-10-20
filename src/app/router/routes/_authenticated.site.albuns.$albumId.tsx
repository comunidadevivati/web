import { getLocalizedPageTitle } from '@/app/router/page-title';
import { AlbumDetailView } from '@/features/gallery/presentation/views/album-detail.view';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/site/albuns/$albumId')({
  head: () => ({
    meta: [{ title: getLocalizedPageTitle('album') }],
  }),
  component: AlbumDetailView,
});
