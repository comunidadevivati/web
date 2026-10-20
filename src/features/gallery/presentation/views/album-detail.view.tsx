import { CardSectionHeader, StatusBadge } from '@/components/molecules';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Heading,
  Input,
  Spinner,
  Text,
} from '@/components/ui';
import { DeletePhotoDialog } from '@/features/gallery/presentation/components/delete-photo-dialog';
import { PhotoTile } from '@/features/gallery/presentation/components/photo-tile';
import { UploadList } from '@/features/gallery/presentation/components/upload-list';
import {
  PHOTO_FILE_ACCEPT,
  albumStatusTones,
} from '@/features/gallery/presentation/models/gallery.model';
import { useAlbumDetailViewModel } from '@/features/gallery/presentation/view-models/album-detail.view-model';
import { AlbumFormView } from '@/features/gallery/presentation/views/album-form.view';
import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';
import {
  ArrowLeftIcon,
  CalendarIcon,
  CircleAlertIcon,
  GlobeIcon,
  ImagePlusIcon,
  ImagesIcon,
  PencilIcon,
  RefreshCwIcon,
} from 'lucide-react';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

// Página do álbum (rota /site/albuns/$albumId): dados, envio de fotos e grade das fotos enviadas.
export const AlbumDetailView = () => {
  const {
    album,
    canEdit,
    cancelDelete,
    clearFinishedUploads,
    confirmDelete,
    deleteTarget,
    errorNotice,
    formKey,
    hasFinishedUploads,
    hasNextPage,
    hasPhotosError,
    isDeleting,
    isEditOpen,
    isLoading,
    isLoadingMore,
    isLoadingPhotos,
    isRetrying,
    isUploading,
    loadMore,
    occurredOn,
    openEdit,
    photoCount,
    photos,
    requestDelete,
    retry,
    setIsEditOpen,
    uploadFiles,
    uploads,
  } = useAlbumDetailViewModel();

  const { t } = useTranslation('gallery');

  const fileInput = useRef<HTMLInputElement>(null);

  return (
    <Box className="grid gap-6">
      <Link
        className="
          inline-flex h-10 w-fit items-center gap-2 rounded-lg text-sm font-medium
          text-primary-strong hover:underline
        "
        to="/site/albuns"
      >
        <ArrowLeftIcon aria-hidden="true" className="size-4" />
        {t('detailPage.back')}
      </Link>

      {isLoading && (
        <Box className="flex min-h-64 items-center justify-center">
          <Spinner className="size-8 text-primary-strong" />
        </Box>
      )}

      {errorNotice && !album && (
        <Alert variant="destructive">
          <CircleAlertIcon />

          <AlertTitle>{t(`notices.${errorNotice}.title`)}</AlertTitle>

          <AlertDescription className="grid gap-3">
            {t(`notices.${errorNotice}.description`)}

            {errorNotice === 'unavailable' && (
              <Button
                className="w-fit"
                disabled={isRetrying}
                size="sm"
                type="button"
                variant="outline"
                onClick={retry}
              >
                <RefreshCwIcon
                  className={cn(isRetrying && 'animate-spin')}
                  data-icon="inline-start"
                />
                {t('actions.retry')}
              </Button>
            )}
          </AlertDescription>
        </Alert>
      )}

      {album && (
        <>
          <Card className="relative overflow-hidden border-border surface-card shadow-sm">
            <Box aria-hidden="true" className="absolute top-0 left-0 h-1 w-full bg-primary" />

            <CardHeader className="grid gap-4 sm:flex sm:items-start">
              <Box className="flex min-w-0 flex-1 items-start gap-4">
                <Box
                  aria-hidden="true"
                  className="
                    flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10
                    text-primary-strong
                  "
                >
                  <ImagesIcon className="size-6" />
                </Box>

                <Box className="grid min-w-0 gap-1.5">
                  <Box className="flex flex-wrap items-center gap-2">
                    <Heading className="text-xl font-semibold break-words text-foreground">
                      {album.title}
                    </Heading>

                    <StatusBadge
                      label={t(`status.${album.status}`)}
                      tone={albumStatusTones[album.status]}
                    />
                  </Box>

                  <Box className="flex flex-wrap gap-x-4 gap-y-1">
                    <Box className="flex items-center gap-1.5">
                      <CalendarIcon aria-hidden="true" className="size-3.5 text-primary-strong" />

                      <Text className="text-sm">{occurredOn}</Text>
                    </Box>

                    <Text className="text-sm">{photoCount}</Text>

                    <Box className="flex min-w-0 items-center gap-1.5">
                      <GlobeIcon aria-hidden="true" className="size-3.5 text-primary-strong" />

                      <Text className="truncate text-sm">
                        {t('detailPage.publicAddress', { slug: album.slug })}
                      </Text>
                    </Box>
                  </Box>

                  {album.description && (
                    <Text className="mt-1 whitespace-pre-line">{album.description}</Text>
                  )}
                </Box>
              </Box>

              {canEdit && (
                <Button className="h-10" type="button" variant="outline" onClick={openEdit}>
                  <PencilIcon data-icon="inline-start" />
                  {t('actions.edit')}
                </Button>
              )}
            </CardHeader>
          </Card>

          <Card className="overflow-hidden border-border surface-card shadow-sm">
            <CardSectionHeader
              description={t('detailPage.photosDescription')}
              icon={ImagesIcon}
              title={t('detailPage.photos')}
            />

            <CardContent className="grid gap-4 pt-4">
              <Box className="flex flex-wrap items-center justify-between gap-3">
                <Text className="text-sm">{t('detailPage.hint')}</Text>

                <Input
                  ref={fileInput}
                  accept={PHOTO_FILE_ACCEPT}
                  aria-hidden="true"
                  className="hidden"
                  multiple
                  tabIndex={-1}
                  type="file"
                  onChange={(event) => {
                    const { files } = event.target;

                    void uploadFiles(files);

                    // Permite escolher de novo os mesmos arquivos.
                    event.target.value = '';
                  }}
                />

                <Button
                  aria-busy={isUploading}
                  className="ml-auto h-10"
                  disabled={!canEdit || isUploading}
                  type="button"
                  onClick={() => fileInput.current?.click()}
                >
                  {isUploading ? (
                    <Spinner data-icon="inline-start" />
                  ) : (
                    <ImagePlusIcon data-icon="inline-start" />
                  )}
                  {t('actions.addPhotos')}
                </Button>
              </Box>

              <UploadList
                canClear={hasFinishedUploads}
                items={uploads}
                onClear={clearFinishedUploads}
              />

              {isLoadingPhotos && (
                <Box className="flex justify-center py-6">
                  <Spinner className="size-6 text-primary-strong" />
                </Box>
              )}

              {hasPhotosError && (
                <Alert variant="destructive">
                  <CircleAlertIcon />

                  <AlertTitle>{t('notices.unavailable.title')}</AlertTitle>

                  <AlertDescription>{t('notices.unavailable.description')}</AlertDescription>
                </Alert>
              )}

              {!isLoadingPhotos && !hasPhotosError && photos.length === 0 && (
                <Text className="py-6 text-center">{t('detailPage.empty')}</Text>
              )}

              {photos.length > 0 && (
                <Box className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {photos.map(({ alt, photo }) => (
                    <PhotoTile
                      key={photo.id}
                      alt={alt}
                      disabled={isDeleting}
                      photo={photo}
                      onDelete={requestDelete}
                    />
                  ))}
                </Box>
              )}

              {hasNextPage && (
                <Button
                  aria-busy={isLoadingMore}
                  className="mx-auto h-11 px-5"
                  disabled={isLoadingMore}
                  type="button"
                  variant="outline"
                  onClick={loadMore}
                >
                  {isLoadingMore && <Spinner data-icon="inline-start" />}
                  {isLoadingMore ? t('listPage.loadingMore') : t('listPage.loadMore')}
                </Button>
              )}
            </CardContent>
          </Card>

          <AlbumFormView
            key={`album-${formKey}`}
            album={album}
            open={isEditOpen}
            onOpenChange={setIsEditOpen}
          />

          <DeletePhotoDialog
            isPending={isDeleting}
            open={deleteTarget !== null}
            onCancel={cancelDelete}
            onConfirm={confirmDelete}
          />
        </>
      )}
    </Box>
  );
};
