import type { GalleryGateway } from '@/features/gallery/domain/gallery';
import { galleryHttpGateway } from '@/features/gallery/infrastructure/http/gallery-http.gateway';

// Exclusão definitiva: o original e as variantes saem do armazenamento.
export const deletePhotoUseCase = (
  csrfToken: string,
  photoId: string,
  gateway: GalleryGateway = galleryHttpGateway,
) => {
  return gateway.deletePhoto(csrfToken, photoId);
};
