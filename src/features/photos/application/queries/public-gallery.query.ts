import { getPublicAlbumUseCase } from '@/features/photos/application/use-cases/get-public-album.use-case';
import { listPublicAlbumsUseCase } from '@/features/photos/application/use-cases/list-public-albums.use-case';
import { listPublicPhotosUseCase } from '@/features/photos/application/use-cases/list-public-photos.use-case';
import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';

const PUBLIC_GALLERY_QUERY_KEY = ['public-gallery'] as const;

// As URLs das fotos podem ser assinadas com validade de 1 h (antes do domínio público): o cache
// não passa de 30 min.
const STALE_TIME_MS = 60 * 1000;

const GC_TIME_MS = 30 * 60 * 1000;

export const publicAlbumsQueryOptions = () => {
  return infiniteQueryOptions({
    queryKey: [...PUBLIC_GALLERY_QUERY_KEY, 'albums'],
    queryFn: ({ pageParam }) => listPublicAlbumsUseCase(pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: ({ nextCursor }) => nextCursor,
    staleTime: STALE_TIME_MS,
    gcTime: GC_TIME_MS,
  });
};

export const publicAlbumQueryOptions = (slug: string) => {
  return queryOptions({
    queryKey: [...PUBLIC_GALLERY_QUERY_KEY, 'album', slug],
    queryFn: () => getPublicAlbumUseCase(slug),
    staleTime: STALE_TIME_MS,
    gcTime: GC_TIME_MS,
    retry: false,
  });
};

export const publicAlbumPhotosQueryOptions = (slug: string) => {
  return infiniteQueryOptions({
    queryKey: [...PUBLIC_GALLERY_QUERY_KEY, 'album', slug, 'photos'],
    queryFn: ({ pageParam }) => listPublicPhotosUseCase(slug, pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: ({ nextCursor }) => nextCursor,
    staleTime: STALE_TIME_MS,
    gcTime: GC_TIME_MS,
  });
};
