import {
  publicAlbumPhotosQueryOptions,
  publicAlbumQueryOptions,
} from '@/features/photos/application/queries/public-gallery.query';
import {
  formatOccurredOn,
  getPublicGalleryNotice,
} from '@/features/photos/presentation/models/public-gallery.model';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

// Página /fotos/$slug: dados do álbum, grade das fotos publicadas e visualizador.
export const usePublicAlbumViewModel = () => {
  const { slug } = useParams({ from: '/fotos/$slug' });

  const { i18n, t } = useTranslation('photos');

  const {
    data: album,
    error,
    isFetching,
    isPending,
    refetch,
  } = useQuery(publicAlbumQueryOptions(slug));

  const {
    data: photoPages,
    error: photosError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending: isLoadingPhotos,
  } = useInfiniteQuery({ ...publicAlbumPhotosQueryOptions(slug), enabled: Boolean(album) });

  // Foto aberta no visualizador.
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const photos = (photoPages?.pages ?? []).flatMap(({ items }) => items);

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  };

  // Na última foto carregada, busca a próxima página antes de avançar.
  const showNext = () => {
    if (lightboxIndex === null) {
      return;
    }

    if (lightboxIndex + 1 < photos.length) {
      setLightboxIndex(lightboxIndex + 1);
    } else if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage().then(() => {
        setLightboxIndex(lightboxIndex + 1);
      });
    }
  };

  return {
    album,
    hasNextPage,
    hasPhotosError: Boolean(photosError),
    isLoading: isPending,
    isLoadingMore: isFetchingNextPage,
    isLoadingPhotos: Boolean(album) && isLoadingPhotos,
    isRetrying: isFetching,
    lightbox: {
      index: lightboxIndex,
      hasNext:
        lightboxIndex !== null && (lightboxIndex + 1 < photos.length || Boolean(hasNextPage)),
      setIndex: setLightboxIndex,
      showNext,
    },
    loadMore,
    notice: error ? getPublicGalleryNotice(error) : null,
    occurredOn: album ? formatOccurredOn(album.occurredOn, i18n.language) : '',
    photoAlt: (position: number) => t('photoAlt', { position, title: album?.title ?? '' }),
    photos,
    retry: () => {
      void refetch();
    },
  };
};
