import { getLocalizedPageTitle } from '@/app/router/page-title';
import { PublicAlbumView } from '@/features/photos/presentation/views/public-album.view';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/fotos/$slug')({
  head: () => ({
    meta: [{ title: getLocalizedPageTitle('photoAlbum') }],
  }),
  component: PublicAlbumView,
});
