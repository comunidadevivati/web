import type { Album, AlbumDetails, GalleryGateway } from '@/features/gallery/domain/gallery';
import { galleryHttpGateway } from '@/features/gallery/infrastructure/http/gallery-http.gateway';

type SaveAlbumCommand = {
  csrfToken: string;
  // Álbum em edição (com a versão lida); null cria um novo, como rascunho.
  album: Album | null;
  details: AlbumDetails;
};

export const saveAlbumUseCase = (
  { album, csrfToken, details }: SaveAlbumCommand,
  gateway: GalleryGateway = galleryHttpGateway,
) => {
  return album
    ? gateway.updateAlbum(csrfToken, album.id, album.version, details)
    : gateway.createAlbum(csrfToken, details);
};
