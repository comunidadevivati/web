import { authSessionQueryOptions } from '@/features/auth/application/queries/auth-session.query';
import {
  GALLERY_QUERY_KEY,
  albumQueryOptions,
} from '@/features/gallery/application/queries/gallery.query';
import { changeAlbumStatusUseCase } from '@/features/gallery/application/use-cases/change-album-status.use-case';
import { changePhotoPublicationUseCase } from '@/features/gallery/application/use-cases/change-photo-publication.use-case';
import { publishAlbumPhotosUseCase } from '@/features/gallery/application/use-cases/publish-album-photos.use-case';
import { setAlbumCoverUseCase } from '@/features/gallery/application/use-cases/set-album-cover.use-case';
import type { AlbumStatusAction, Photo } from '@/features/gallery/domain/gallery';
import {
  albumStatusActions,
  getConflictDetail,
  getGalleryNotice,
} from '@/features/gallery/presentation/models/gallery.model';
import { notify } from '@/shared/feedback/notify';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

// Publicação do álbum e das fotos (ADR 0010 do backend): status do álbum, "publicar todas",
// publicar/despublicar uma foto e escolher a capa.
export const useAlbumPublicationViewModel = () => {
  const { albumId } = useParams({ from: '/_authenticated/site/albuns/$albumId' });

  const { t } = useTranslation('gallery');

  const queryClient = useQueryClient();

  const { data: session } = useQuery(authSessionQueryOptions);

  const { data: album } = useQuery(albumQueryOptions(albumId));

  // Foto com uma ação em andamento (publicar, despublicar ou virar capa).
  const [busyPhotoId, setBusyPhotoId] = useState<string | null>(null);

  const [publishedSoFar, setPublishedSoFar] = useState(0);

  const refresh = () => {
    return queryClient.invalidateQueries({ queryKey: GALLERY_QUERY_KEY });
  };

  const notifyError = (error: Error) => {
    const notice = getGalleryNotice(error);

    notify.error({
      title: t(`notices.${notice}.title`),
      description: getConflictDetail(error) ?? t(`notices.${notice}.description`),
    });
  };

  const csrfToken = session?.csrfToken ?? '';

  const statusMutation = useMutation({
    mutationFn: (action: AlbumStatusAction) => changeAlbumStatusUseCase(csrfToken, albumId, action),
    onSuccess: async (_album, action) => {
      notify.success({ title: t(`publication.status.${action}.success`) });

      await refresh();
    },
    onError: notifyError,
  });

  const publishAllMutation = useMutation({
    mutationFn: () => {
      setPublishedSoFar(0);

      return publishAlbumPhotosUseCase(csrfToken, albumId, setPublishedSoFar);
    },
    onSuccess: async (count) => {
      notify.success({ title: t('publication.publishAll.success', { count }) });

      await refresh();
    },
    onError: async (error) => {
      notifyError(error);

      // Lotes anteriores podem ter sido publicados antes da falha.
      await refresh();
    },
  });

  const photoMutation = useMutation({
    mutationFn: ({ photo, publish }: { photo: Photo; publish: boolean }) =>
      changePhotoPublicationUseCase(csrfToken, photo.id, publish),
    onMutate: ({ photo }) => {
      setBusyPhotoId(photo.id);
    },
    onSuccess: async (_photo, { publish }) => {
      notify.success({
        title: t(publish ? 'publication.photo.published' : 'publication.photo.unpublished'),
      });

      await refresh();
    },
    onError: notifyError,
    onSettled: () => {
      setBusyPhotoId(null);
    },
  });

  const coverMutation = useMutation({
    mutationFn: (photo: Photo) => setAlbumCoverUseCase(csrfToken, albumId, photo.id),
    onMutate: (photo) => {
      setBusyPhotoId(photo.id);
    },
    onSuccess: async () => {
      notify.success({ title: t('publication.cover.success') });

      await refresh();
    },
    onError: notifyError,
    onSettled: () => {
      setBusyPhotoId(null);
    },
  });

  const isBusy =
    statusMutation.isPending ||
    publishAllMutation.isPending ||
    photoMutation.isPending ||
    coverMutation.isPending;

  const canChange = Boolean(session) && !isBusy;

  const isArchived = album?.status === 'ARCHIVED';

  // Prontas e ainda não publicadas.
  const unpublishedCount = album ? album.photoCount - album.publishedPhotoCount : 0;

  return {
    busyPhotoId,
    // Publicar exige ao menos uma foto publicada; as demais transições não têm pré-requisito.
    canRunStatusAction: (action: AlbumStatusAction) =>
      canChange && (action !== 'publish' || (album?.publishedPhotoCount ?? 0) > 0),
    changeStatus: (action: AlbumStatusAction) => {
      if (canChange) {
        statusMutation.mutate(action);
      }
    },
    coverPhotoId: album?.coverPhotoId ?? null,
    // Fotos de álbum arquivado ainda podem sair do site, mas não ser publicadas.
    canPublishPhotos: canChange && !isArchived,
    canUnpublishPhotos: canChange,
    isPublishingAll: publishAllMutation.isPending,
    pendingStatusAction: statusMutation.isPending ? statusMutation.variables : null,
    publishAll: () => {
      if (canChange && !isArchived && unpublishedCount > 0) {
        publishAllMutation.mutate();
      }
    },
    // Contagem exibida no botão: publicadas até agora durante o lote, ou as que faltam.
    publishAllCount: publishAllMutation.isPending ? publishedSoFar : unpublishedCount,
    publishedSummary: t('publication.summary', {
      published: album?.publishedPhotoCount ?? 0,
      total: album?.photoCount ?? 0,
    }),
    setCover: (photo: Photo) => {
      if (canChange && !isArchived) {
        coverMutation.mutate(photo);
      }
    },
    statusActions: album ? albumStatusActions[album.status] : [],
    togglePhotoPublication: (photo: Photo) => {
      if (canChange) {
        photoMutation.mutate({ photo, publish: photo.publishedAt === null });
      }
    },
    unpublishedCount,
  };
};
