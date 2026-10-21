import type { AlbumStatusAction, GalleryGateway } from '@/features/gallery/domain/gallery';
import { galleryHttpGateway } from '@/features/gallery/infrastructure/http/gallery-http.gateway';

export const changeAlbumStatusUseCase = (
  csrfToken: string,
  albumId: string,
  action: AlbumStatusAction,
  gateway: GalleryGateway = galleryHttpGateway,
) => {
  return gateway.changeAlbumStatus(csrfToken, albumId, action);
};
