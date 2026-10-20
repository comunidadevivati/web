import type { GalleryGateway } from '@/features/gallery/domain/gallery';
import { galleryHttpGateway } from '@/features/gallery/infrastructure/http/gallery-http.gateway';

export const listPhotosUseCase = (
  albumId: string,
  cursor: string | null,
  gateway: GalleryGateway = galleryHttpGateway,
) => {
  return gateway.listPhotos(albumId, cursor);
};
