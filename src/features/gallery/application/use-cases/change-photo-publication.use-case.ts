import type { GalleryGateway } from '@/features/gallery/domain/gallery';
import { galleryHttpGateway } from '@/features/gallery/infrastructure/http/gallery-http.gateway';

// Publicar copia as variantes para a área pública; despublicar as apaga e tira do cache da CDN.
export const changePhotoPublicationUseCase = (
  csrfToken: string,
  photoId: string,
  publish: boolean,
  gateway: GalleryGateway = galleryHttpGateway,
) => {
  return publish
    ? gateway.publishPhoto(csrfToken, photoId)
    : gateway.unpublishPhoto(csrfToken, photoId);
};
