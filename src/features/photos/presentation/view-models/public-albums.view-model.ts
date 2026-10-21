import { publicAlbumsQueryOptions } from '@/features/photos/application/queries/public-gallery.query';
import {
  formatOccurredOn,
  getPublicGalleryNotice,
} from '@/features/photos/presentation/models/public-gallery.model';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

// Página /fotos: álbuns publicados, mais recentes primeiro.
export const usePublicAlbumsViewModel = () => {
  const { i18n } = useTranslation('photos');

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isPending,
    refetch,
  } = useInfiniteQuery(publicAlbumsQueryOptions());

  const albums = (data?.pages ?? [])
    .flatMap(({ items }) => items)
    .map((album) => ({ album, occurredOn: formatOccurredOn(album.occurredOn, i18n.language) }));

  return {
    albums,
    hasNextPage,
    isLoading: isPending,
    isLoadingMore: isFetchingNextPage,
    isRetrying: isFetching,
    loadMore: () => {
      if (hasNextPage && !isFetchingNextPage) {
        void fetchNextPage();
      }
    },
    notice: error ? getPublicGalleryNotice(error) : null,
    retry: () => {
      void refetch();
    },
  };
};
