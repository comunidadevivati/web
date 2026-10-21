import {
  PublicAlbumNotFoundError,
  PublicGalleryUnavailableError,
  type PublicGalleryGateway,
} from '@/features/photos/domain/public-gallery';
import { bffClient } from '@/shared/http/bff-client';
import { isHTTPError } from 'ky';
import { z } from 'zod';

// Contratos de /api/v1/public/gallery no BFF (repassados da Core API, sem sessão).
const photoSchema = z.object({
  id: z.string(),
  width: z.number().int(),
  height: z.number().int(),
  placeholder: z.string().nullable(),
  variants: z.array(
    z.object({
      width: z.number().int(),
      avif: z.url(),
      webp: z.url(),
    }),
  ),
});

const albumSchema = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  occurredOn: z.string(),
  publishedAt: z.string().nullable(),
  photoCount: z.number().int(),
  cover: photoSchema.nullable(),
});

const pageOf = <T extends z.ZodType>(item: T) =>
  z.object({
    items: z.array(item),
    nextCursor: z.string().nullable(),
  });

const request = async <T>(schema: z.ZodType<T>, call: () => Promise<Response>) => {
  let body: unknown;

  try {
    body = await (await call()).json();
  } catch (error) {
    if (isHTTPError(error) && error.response.status === 404) {
      throw new PublicAlbumNotFoundError();
    }

    throw new PublicGalleryUnavailableError(error);
  }

  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    throw new PublicGalleryUnavailableError(parsed.error);
  }

  return parsed.data;
};

const albumPath = (slug: string) => {
  return `api/v1/public/gallery/albums/${encodeURIComponent(slug)}`;
};

const cursorParams = (cursor: string | null) => {
  return cursor ? new URLSearchParams({ cursor }) : undefined;
};

export const publicGalleryHttpGateway: PublicGalleryGateway = {
  listAlbums: (cursor) => {
    return request(pageOf(albumSchema), () =>
      bffClient.get('api/v1/public/gallery/albums', { searchParams: cursorParams(cursor) }),
    );
  },

  getAlbum: (slug) => {
    return request(albumSchema, () => bffClient.get(albumPath(slug)));
  },

  listPhotos: (slug, cursor) => {
    return request(pageOf(photoSchema), () =>
      bffClient.get(`${albumPath(slug)}/photos`, { searchParams: cursorParams(cursor) }),
    );
  },
};
