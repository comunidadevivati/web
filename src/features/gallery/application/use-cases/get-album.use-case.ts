import type { GalleryGateway } from '@/features/gallery/domain/gallery';
import { galleryHttpGateway } from '@/features/gallery/infrastructure/http/gallery-http.gateway';

export const getAlbumUseCase = (id: string, gateway: GalleryGateway = galleryHttpGateway) => {
  return gateway.getAlbum(id);
};
