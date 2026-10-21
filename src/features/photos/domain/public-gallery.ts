// Galeria do site público (ADR 0010 do backend): somente álbuns publicados e fotos publicadas, como
// o BFF os expõe a visitantes anônimos.

export type PublicPhotoVariant = {
  width: number;
  avif: string;
  webp: string;
};

export type PublicPhoto = {
  id: string;
  width: number;
  height: number;
  // Imagem minúscula em data URI, exibida enquanto a foto carrega.
  placeholder: string | null;
  // Da menor para a maior largura.
  variants: PublicPhotoVariant[];
};

export type PublicAlbum = {
  // Identificador estável da URL (/fotos/$slug).
  slug: string;
  title: string;
  description: string | null;
  // Data civil ISO (AAAA-MM-DD).
  occurredOn: string;
  publishedAt: string | null;
  // Fotos publicadas.
  photoCount: number;
  cover: PublicPhoto | null;
};

export type PublicPage<T> = {
  items: T[];
  nextCursor: string | null;
};

export class PublicAlbumNotFoundError extends Error {
  constructor() {
    super('Public album not found');

    this.name = 'PublicAlbumNotFoundError';
  }
}

// O BFF não respondeu ou respondeu fora do contrato.
export class PublicGalleryUnavailableError extends Error {
  constructor(cause?: unknown) {
    super('Public gallery unavailable', { cause });

    this.name = 'PublicGalleryUnavailableError';
  }
}

export interface PublicGalleryGateway {
  listAlbums: (cursor: string | null) => Promise<PublicPage<PublicAlbum>>;
  getAlbum: (slug: string) => Promise<PublicAlbum>;
  listPhotos: (slug: string, cursor: string | null) => Promise<PublicPage<PublicPhoto>>;
}
