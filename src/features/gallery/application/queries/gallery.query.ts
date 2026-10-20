import { getAlbumUseCase } from '@/features/gallery/application/use-cases/get-album.use-case';
import { listAlbumsUseCase } from '@/features/gallery/application/use-cases/list-albums.use-case';
import { listPhotosUseCase } from '@/features/gallery/application/use-cases/list-photos.use-case';
import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';

// Raiz das chaves da galeria: invalidada após qualquer alteração.
export const GALLERY_QUERY_KEY = ['gallery'] as const;

// Enquanto houver foto em processamento, a lista é consultada de novo neste intervalo.
const PROCESSING_POLL_MS = 3_000;

export const albumsQueryOptions = () => {
  return infiniteQueryOptions({
    queryKey: [...GALLERY_QUERY_KEY, 'albums'],
    queryFn: ({ pageParam }) => listAlbumsUseCase(pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: ({ nextCursor }) => nextCursor,
  });
};

export const albumQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: [...GALLERY_QUERY_KEY, 'album', id],
    queryFn: () => getAlbumUseCase(id),
  });
};

// As miniaturas usam URLs de validade curta (1 h): a lista não fica em cache por mais tempo.
export const albumPhotosQueryOptions = (albumId: string) => {
  return infiniteQueryOptions({
    queryKey: [...GALLERY_QUERY_KEY, 'album', albumId, 'photos'],
    queryFn: ({ pageParam }) => listPhotosUseCase(albumId, pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: ({ nextCursor }) => nextCursor,
    gcTime: 30 * 60 * 1000,
    refetchInterval: ({ state: { data } }) => {
      const processing = (data?.pages ?? []).some(({ items }) =>
        items.some(({ status }) => status === 'PROCESSING'),
      );

      return processing ? PROCESSING_POLL_MS : false;
    },
  });
};
