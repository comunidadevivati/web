// Contexto Gallery (ADR 0010 do backend): álbuns e fotos, como o BFF os expõe ao painel.

export type AlbumStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

// Datas civis ISO (AAAA-MM-DD); publishedAt em ISO 8601.
export type Album = {
  id: string;
  // Identificador estável da URL pública (não muda com o título).
  slug: string;
  title: string;
  description: string | null;
  occurredOn: string;
  coverPhotoId: string | null;
  status: AlbumStatus;
  publishedAt: string | null;
  // Versão lida: a edição a devolve (concorrência otimista).
  version: number;
  // Fotos prontas (processadas) e, delas, as publicadas no site.
  photoCount: number;
  publishedPhotoCount: number;
};

// Transições do álbum: publicar exige ao menos uma foto publicada; arquivar exige rascunho.
export type AlbumStatusAction = 'publish' | 'unpublish' | 'archive' | 'restore';

// Lote de "publicar todas": o painel repete enquanto houver fotos restantes.
export type PublishBatch = {
  published: number;
  remaining: number;
};

export type AlbumDetails = {
  title: string;
  description: string | null;
  occurredOn: string;
};

export type AlbumPage = {
  items: Album[];
  nextCursor: string | null;
};

export type PhotoStatus = 'PROCESSING' | 'READY' | 'FAILED';

export type PhotoFailure = 'invalid_image' | 'processing_error';

export type Photo = {
  id: string;
  albumId: string;
  status: PhotoStatus;
  width: number | null;
  height: number | null;
  // Imagem minúscula em data URI, exibida enquanto a miniatura carrega.
  placeholder: string | null;
  failure: PhotoFailure | null;
  // URL de leitura de validade curta, somente para fotos prontas.
  previewUrl: string | null;
  // Publicada no site; null quando não publicada.
  publishedAt: string | null;
  version: number;
};

export type PhotoPage = {
  items: Photo[];
  nextCursor: string | null;
};

export type UploadFile = {
  contentType: string;
  byteSize: number;
};

// O navegador envia o arquivo com PUT na uploadUrl, com exatamente este Content-Type.
export type UploadTicket = {
  photoId: string;
  uploadUrl: string;
  contentType: string;
  expiresAt: string;
};

// Formatos e limites aceitos pela Core API.
export const ACCEPTED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

export const MAX_PHOTO_BYTES = 25 * 1024 * 1024;

export const MAX_UPLOADS_PER_REQUEST = 50;

export const isAcceptedPhotoType = (type: string) => {
  return (ACCEPTED_PHOTO_TYPES as readonly string[]).includes(type);
};

// Campos recusados pelo servidor, no formato de caminho do contrato (ex.: occurredOn).
export class InvalidGalleryDataError extends Error {
  readonly fields: string[];

  constructor(fields: string[]) {
    super('Invalid gallery data');

    this.name = 'InvalidGalleryDataError';

    this.fields = fields;
  }
}

// Conflito de regra (versão desatualizada, álbum arquivado ou cheio, envio ausente...). detail é a
// explicação devolvida pelo servidor, quando houver.
export class GalleryConflictError extends Error {
  readonly detail?: string;

  constructor(detail?: string) {
    super('Gallery conflict');

    this.name = 'GalleryConflictError';

    this.detail = detail;
  }
}

export class GalleryNotFoundError extends Error {
  constructor() {
    super('Gallery record not found');

    this.name = 'GalleryNotFoundError';
  }
}

// Conta sem e-mail verificado (HTTP 403).
export class GalleryAccessDeniedError extends Error {
  constructor() {
    super('Gallery access denied');

    this.name = 'GalleryAccessDeniedError';
  }
}

// O BFF não respondeu, respondeu fora do contrato ou o armazenamento não está configurado.
export class GalleryUnavailableError extends Error {
  constructor(cause?: unknown) {
    super('Gallery service unavailable', { cause });

    this.name = 'GalleryUnavailableError';
  }
}

// O envio direto ao bucket falhou (rede ou recusa do armazenamento).
export class PhotoTransferError extends Error {
  readonly status: number;

  constructor(status: number) {
    super('Photo transfer failed');

    this.name = 'PhotoTransferError';

    this.status = status;
  }
}

// Alterações exigem o token CSRF da sessão; a edição do álbum exige também a versão lida.
export interface GalleryGateway {
  listAlbums: (cursor: string | null) => Promise<AlbumPage>;
  getAlbum: (id: string) => Promise<Album>;
  createAlbum: (csrfToken: string, details: AlbumDetails) => Promise<Album>;
  updateAlbum: (
    csrfToken: string,
    id: string,
    version: number,
    details: AlbumDetails,
  ) => Promise<Album>;
  listPhotos: (albumId: string, cursor: string | null) => Promise<PhotoPage>;
  requestUploads: (
    csrfToken: string,
    albumId: string,
    files: readonly UploadFile[],
  ) => Promise<UploadTicket[]>;
  completeUpload: (csrfToken: string, photoId: string) => Promise<Photo>;
  deletePhoto: (csrfToken: string, photoId: string) => Promise<void>;
  publishPhoto: (csrfToken: string, photoId: string) => Promise<Photo>;
  unpublishPhoto: (csrfToken: string, photoId: string) => Promise<Photo>;
  publishAlbumPhotos: (csrfToken: string, albumId: string) => Promise<PublishBatch>;
  setAlbumCover: (csrfToken: string, albumId: string, photoId: string) => Promise<Album>;
  changeAlbumStatus: (
    csrfToken: string,
    albumId: string,
    action: AlbumStatusAction,
  ) => Promise<Album>;
}

// Envio direto do navegador ao bucket (fora do BFF), com progresso de 0 a 1.
export interface PhotoTransfer {
  send: (ticket: UploadTicket, file: Blob, onProgress: (fraction: number) => void) => Promise<void>;
}
