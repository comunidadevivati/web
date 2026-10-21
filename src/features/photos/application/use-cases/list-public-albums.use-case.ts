import type { PublicGalleryGateway } from '@/features/photos/domain/public-gallery';
import { publicGalleryHttpGateway } from '@/features/photos/infrastructure/http/public-gallery-http.gateway';

export const listPublicAlbumsUseCase = (
  cursor: string | null,
  gateway: PublicGalleryGateway = publicGalleryHttpGateway,
) => {
  return gateway.listAlbums(cursor);
};
