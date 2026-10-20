import { authSessionQueryOptions } from '@/features/auth/application/queries/auth-session.query';
import {
  GALLERY_QUERY_KEY,
  albumPhotosQueryOptions,
  albumQueryOptions,
} from '@/features/gallery/application/queries/gallery.query';
import { deletePhotoUseCase } from '@/features/gallery/application/use-cases/delete-photo.use-case';
import {
  uploadPhotosUseCase,
  type UploadUpdate,
} from '@/features/gallery/application/use-cases/upload-photos.use-case';
import type { Photo } from '@/features/gallery/domain/gallery';
import {
  formatCivilDate,
  getGalleryNotice,
  isFinishedUpload,
  type UploadItem,
} from '@/features/gallery/presentation/models/gallery.model';
import { notify } from '@/shared/feedback/notify';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const useAlbumDetailViewModel = () => {
  const { albumId } = useParams({ from: '/_authenticated/site/albuns/$albumId' });

  const { i18n, t } = useTranslation('gallery');

  const queryClient = useQueryClient();

  const { data: session } = useQuery(authSessionQueryOptions);

  const {
    data: album,
    error,
    isFetching,
    isPending,
    refetch,
  } = useQuery(albumQueryOptions(albumId));

  const {
    data: photoPages,
    error: photosError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending: isLoadingPhotos,
  } = useInfiniteQuery({ ...albumPhotosQueryOptions(albumId), enabled: Boolean(album) });

  const [isEditOpen, setIsEditOpen] = useState(false);

  const [formKey, setFormKey] = useState(0);

  const [uploads, setUploads] = useState<UploadItem[]>([]);

  const [isUploading, setIsUploading] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Photo | null>(null);

  // Sair da página no meio do envio interromperia as transferências em andamento.
  useEffect(() => {
    if (!isUploading) {
      return undefined;
    }

    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };

    window.addEventListener('beforeunload', warn);

    return () => {
      window.removeEventListener('beforeunload', warn);
    };
  }, [isUploading]);

  const refresh = () => {
    return queryClient.invalidateQueries({ queryKey: GALLERY_QUERY_KEY });
  };

  const photos = (photoPages?.pages ?? [])
    .flatMap(({ items }) => items)
    .map((photo, index) => ({
      photo,
      alt: t('detailPage.photoAlt', { position: index + 1, title: album?.title ?? '' }),
    }));

  const uploadFiles = async (selected: FileList | null) => {
    const files = [...(selected ?? [])];

    if (!session || !album || files.length === 0 || isUploading) {
      return;
    }

    const keys = files.map(() => crypto.randomUUID());

    setUploads((current) => [
      ...current.filter((item) => !isFinishedUpload(item)),
      ...files.map(({ name }, index) => ({
        key: keys[index] ?? name,
        name,
        stage: 'waiting' as const,
        progress: 0,
      })),
    ]);

    setIsUploading(true);

    const onUpdate = (index: number, update: UploadUpdate) => {
      setUploads((current) =>
        current.map((item) => (item.key === keys[index] ? { ...item, ...update } : item)),
      );
    };

    try {
      const { failed, sent } = await uploadPhotosUseCase({
        csrfToken: session.csrfToken,
        albumId: album.id,
        files,
        onUpdate,
      });

      if (failed > 0) {
        notify.error({
          title: t('uploads.partial.title'),
          description: t('uploads.partial.description', { count: files.length, failed }),
        });
      } else if (sent > 0) {
        notify.success({
          title: t('uploads.success.title', { count: sent }),
          description: t('uploads.success.description', { count: sent }),
        });
      }
    } finally {
      setIsUploading(false);

      await refresh();
    }
  };

  const clearFinishedUploads = () => {
    setUploads((current) => current.filter((item) => !isFinishedUpload(item)));
  };

  const { isPending: isDeleting, mutate: removePhoto } = useMutation({
    mutationFn: ({ csrfToken, photo }: { csrfToken: string; photo: Photo }) =>
      deletePhotoUseCase(csrfToken, photo.id),
    onSuccess: async () => {
      setDeleteTarget(null);

      notify.success({ title: t('confirmDelete.success') });

      await refresh();
    },
    onError: (deleteError) => {
      setDeleteTarget(null);

      const notice = getGalleryNotice(deleteError);

      notify.error({
        title: t(`notices.${notice}.title`),
        description: t(`notices.${notice}.description`),
      });
    },
  });

  const confirmDelete = () => {
    if (deleteTarget && session && !isDeleting) {
      removePhoto({ csrfToken: session.csrfToken, photo: deleteTarget });
    }
  };

  const openEdit = () => {
    setFormKey((key) => key + 1);

    setIsEditOpen(true);
  };

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  };

  return {
    album,
    canEdit: album !== undefined && album.status !== 'ARCHIVED',
    cancelDelete: () => {
      setDeleteTarget(null);
    },
    clearFinishedUploads,
    confirmDelete,
    deleteTarget,
    errorNotice: error ? getGalleryNotice(error) : null,
    formKey,
    hasFinishedUploads: uploads.some((item) => isFinishedUpload(item)),
    hasNextPage,
    hasPhotosError: Boolean(photosError),
    isDeleting,
    isEditOpen,
    isLoading: isPending,
    isLoadingMore: isFetchingNextPage,
    isLoadingPhotos: Boolean(album) && isLoadingPhotos,
    isRetrying: isFetching,
    isUploading,
    loadMore,
    occurredOn: album ? formatCivilDate(album.occurredOn, i18n.language) : '',
    openEdit,
    photoCount: t('listPage.photoCount', { count: album?.photoCount ?? 0 }),
    photos,
    requestDelete: setDeleteTarget,
    retry: () => {
      void refetch();
    },
    setIsEditOpen,
    uploadFiles,
    uploads,
  };
};
