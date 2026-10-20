import { albumsQueryOptions } from '@/features/gallery/application/queries/gallery.query';
import {
  formatCivilDate,
  getGalleryNotice,
} from '@/features/gallery/presentation/models/gallery.model';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const useAlbumsViewModel = () => {
  const { i18n, t } = useTranslation('gallery');

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Cada abertura monta um formulário novo.
  const [createFormKey, setCreateFormKey] = useState(0);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isPending,
    refetch,
  } = useInfiniteQuery(albumsQueryOptions());

  const items = (data?.pages ?? [])
    .flatMap(({ items: page }) => page)
    .map((album) => ({
      album,
      occurredOn: formatCivilDate(album.occurredOn, i18n.language),
      photoCount: t('listPage.photoCount', { count: album.photoCount }),
    }));

  const openCreate = () => {
    setCreateFormKey((key) => key + 1);

    setIsCreateOpen(true);
  };

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  };

  const retry = () => {
    void refetch();
  };

  return {
    createFormKey,
    errorNotice: error ? getGalleryNotice(error) : null,
    hasNextPage,
    isCreateOpen,
    isLoading: isPending,
    isLoadingMore: isFetchingNextPage,
    isRetrying: isFetching,
    items,
    loadMore,
    openCreate,
    retry,
    setIsCreateOpen,
  };
};
