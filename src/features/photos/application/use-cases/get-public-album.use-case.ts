import type { PublicGalleryGateway } from '@/features/photos/domain/public-gallery';
import { publicGalleryHttpGateway } from '@/features/photos/infrastructure/http/public-gallery-http.gateway';

export const getPublicAlbumUseCase = (
  slug: string,
  gateway: PublicGalleryGateway = publicGalleryHttpGateway,
) => {
  return gateway.getAlbum(slug);
};
