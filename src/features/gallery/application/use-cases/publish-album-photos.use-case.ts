import type { GalleryGateway } from '@/features/gallery/domain/gallery';
import { galleryHttpGateway } from '@/features/gallery/infrastructure/http/gallery-http.gateway';

// Limite de lotes por chamada, contra repetição sem fim se o servidor não avançar.
const MAX_BATCHES = 100;

// "Publicar todas": o servidor publica um lote por chamada e informa quantas faltam. Para quando
// não restar nenhuma ou quando um lote não publicar nada (fotos alteradas ao mesmo tempo).
export const publishAlbumPhotosUseCase = async (
  csrfToken: string,
  albumId: string,
  onProgress: (published: number) => void,
  gateway: GalleryGateway = galleryHttpGateway,
) => {
  let total = 0;

  for (let batch = 0; batch < MAX_BATCHES; batch += 1) {
    // oxlint-disable-next-line no-await-in-loop -- lotes sucessivos, um por vez
    const { published, remaining } = await gateway.publishAlbumPhotos(csrfToken, albumId);

    total += published;

    onProgress(total);

    if (remaining === 0 || published === 0) {
      break;
    }
  }

  return total;
};
