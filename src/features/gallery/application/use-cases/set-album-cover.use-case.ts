import type { GalleryGateway } from '@/features/gallery/domain/gallery';
import { galleryHttpGateway } from '@/features/gallery/infrastructure/http/gallery-http.gateway';

// A capa precisa ser uma foto publicada do próprio álbum.
export const setAlbumCoverUseCase = (
  csrfToken: string,
  albumId: string,
  photoId: string,
  gateway: GalleryGateway = galleryHttpGateway,
) => {
  return gateway.setAlbumCover(csrfToken, albumId, photoId);
};
