import { getLocalizedPageTitle } from '@/app/router/page-title';
import { PublicAlbumsView } from '@/features/photos/presentation/views/public-albums.view';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/fotos/')({
  head: () => ({
    meta: [{ title: getLocalizedPageTitle('photos') }],
  }),
  component: PublicAlbumsView,
});
