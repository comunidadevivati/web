import {
  GalleryAccessDeniedError,
  GalleryConflictError,
  GalleryNotFoundError,
  GalleryUnavailableError,
  InvalidGalleryDataError,
  type GalleryGateway,
} from '@/features/gallery/domain/gallery';
import { bffClient } from '@/shared/http/bff-client';
import { readProblemDetails } from '@/shared/http/problem-details';
import { isHTTPError } from 'ky';
import { z } from 'zod';

// Contratos de /api/v1/gallery no BFF (repassados da Core API).
const albumSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  occurredOn: z.string(),
  coverPhotoId: z.string().nullable(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  publishedAt: z.string().nullable(),
  version: z.number().int(),
  photoCount: z.number().int(),
});

const albumPageSchema = z.object({
  items: z.array(albumSchema),
  nextCursor: z.string().nullable(),
});

const photoSchema = z.object({
  id: z.string(),
  albumId: z.string(),
  status: z.enum(['PROCESSING', 'READY', 'FAILED']),
  width: z.number().int().nullable(),
  height: z.number().int().nullable(),
  placeholder: z.string().nullable(),
  failure: z.enum(['invalid_image', 'processing_error']).nullable(),
  previewUrl: z.string().nullable(),
  version: z.number().int(),
});

const photoPageSchema = z.object({
  items: z.array(photoSchema),
  nextCursor: z.string().nullable(),
});

const uploadTicketsSchema = z.object({
  items: z.array(
    z.object({
      photoId: z.string(),
      uploadUrl: z.url(),
      contentType: z.string(),
      expiresAt: z.string(),
    }),
  ),
});

// Normaliza as falhas do BFF em erros do domínio. O 401 (sessão expirada) já é tratado pelo
// bffClient, que leva ao login; aqui ele vira apenas indisponibilidade.
// O corpo do erro vem em error.data: o Ky 2 já o consumiu ao criar o HTTPError.
const toDomainError = (error: unknown) => {
  if (!isHTTPError(error)) {
    return new GalleryUnavailableError(error);
  }

  const { data, response } = error;

  switch (response.status) {
    case 400: {
      const { fields = [] } = readProblemDetails(data);

      return new InvalidGalleryDataError(fields);
    }

    case 403:
      return new GalleryAccessDeniedError();

    case 404:
      return new GalleryNotFoundError();

    case 409: {
      const { detail } = readProblemDetails(data);

      return new GalleryConflictError(detail);
    }

    default:
      return new GalleryUnavailableError(error);
  }
};

const send = async (call: () => Promise<Response>) => {
  try {
    return await call();
  } catch (error) {
    throw toDomainError(error);
  }
};

const request = async <T>(schema: z.ZodType<T>, call: () => Promise<Response>) => {
  const response = await send(call);

  let body: unknown;

  try {
    body = await response.json();
  } catch (error) {
    throw new GalleryUnavailableError(error);
  }

  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    throw new GalleryUnavailableError(parsed.error);
  }

  return parsed.data;
};

const csrfHeaders = (csrfToken: string) => ({
  'X-CSRF-Token': csrfToken,
});

const albumPath = (id: string) => {
  return `api/v1/gallery/albums/${encodeURIComponent(id)}`;
};

const photoPath = (id: string) => {
  return `api/v1/gallery/photos/${encodeURIComponent(id)}`;
};

const cursorParams = (cursor: string | null) => {
  return cursor ? new URLSearchParams({ cursor }) : undefined;
};

export const galleryHttpGateway: GalleryGateway = {
  listAlbums: (cursor) => {
    return request(albumPageSchema, () =>
      bffClient.get('api/v1/gallery/albums', { searchParams: cursorParams(cursor) }),
    );
  },

  getAlbum: (id) => {
    return request(albumSchema, () => bffClient.get(albumPath(id)));
  },

  createAlbum: (csrfToken, details) => {
    return request(albumSchema, () =>
      bffClient.post('api/v1/gallery/albums', { headers: csrfHeaders(csrfToken), json: details }),
    );
  },

  updateAlbum: (csrfToken, id, version, details) => {
    return request(albumSchema, () =>
      bffClient.patch(albumPath(id), {
        headers: csrfHeaders(csrfToken),
        json: { version, ...details },
      }),
    );
  },

  listPhotos: (albumId, cursor) => {
    return request(photoPageSchema, () =>
      bffClient.get(`${albumPath(albumId)}/photos`, { searchParams: cursorParams(cursor) }),
    );
  },

  requestUploads: async (csrfToken, albumId, files) => {
    const { items } = await request(uploadTicketsSchema, () =>
      bffClient.post(`${albumPath(albumId)}/uploads`, {
        headers: csrfHeaders(csrfToken),
        json: { files },
      }),
    );

    return items;
  },

  completeUpload: (csrfToken, photoId) => {
    return request(photoSchema, () =>
      bffClient.post(`${photoPath(photoId)}/complete`, { headers: csrfHeaders(csrfToken) }),
    );
  },

  deletePhoto: async (csrfToken, photoId) => {
    await send(() => bffClient.delete(photoPath(photoId), { headers: csrfHeaders(csrfToken) }));
  },
};
