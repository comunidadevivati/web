import type { GalleryGateway } from '@/features/gallery/domain/gallery';
import { galleryHttpGateway } from '@/features/gallery/infrastructure/http/gallery-http.gateway';

export const listAlbumsUseCase = (
  cursor: string | null,
  gateway: GalleryGateway = galleryHttpGateway,
) => {
  return gateway.listAlbums(cursor);
};
