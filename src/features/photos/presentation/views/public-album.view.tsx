import { AppFooter, PublicHeader } from '@/components/organisms';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Box,
  Button,
  Heading,
  Spinner,
  Text,
} from '@/components/ui';
import { PhotoLightbox } from '@/features/photos/presentation/components/photo-lightbox';
import { PublicPhotoImage } from '@/features/photos/presentation/components/public-photo-image';
import { usePublicAlbumViewModel } from '@/features/photos/presentation/view-models/public-album.view-model';
import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';
import { ArrowLeftIcon, CalendarIcon, CircleAlertIcon, RefreshCwIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Página pública /fotos/$slug: fotos publicadas de um álbum, com visualizador em tela cheia.
export const PublicAlbumView = () => {
  const {
    album,
    hasNextPage,
    hasPhotosError,
    isLoading,
    isLoadingMore,
    isLoadingPhotos,
    isRetrying,
    lightbox,
    loadMore,
    notice,
    occurredOn,
    photoAlt,
    photos,
    retry,
  } = usePublicAlbumViewModel();

  const { t } = useTranslation('photos');

  return (
    <Box className="flex min-h-dvh flex-col overflow-x-clip bg-background">
      <PublicHeader />

      <Box className="flex-1" role="main">
        <Box
          className="
            mx-auto grid w-full max-w-360 gap-6 px-4 py-8 sm:gap-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12
          "
        >
          <Link
            className="
              inline-flex h-10 w-fit items-center gap-2 rounded-lg text-sm font-medium
              text-primary-strong hover:underline
            "
            to="/fotos"
          >
            <ArrowLeftIcon aria-hidden="true" className="size-4" />
            {t('back')}
          </Link>

          {isLoading && (
            <Box className="flex min-h-48 items-center justify-center">
              <Spinner className="size-8 text-primary-strong" />
            </Box>
          )}

          {notice && (
            <Alert variant={notice === 'notFound' ? 'default' : 'destructive'}>
              <CircleAlertIcon />

              <AlertTitle>{t(`notices.${notice}.title`)}</AlertTitle>

              <AlertDescription className="grid gap-3">
                {t(`notices.${notice}.description`)}

                {notice === 'unavailable' && (
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
                    {t('retry')}
                  </Button>
                )}
              </AlertDescription>
            </Alert>
          )}

          {album && (
            <>
              <Box className="grid max-w-3xl gap-3">
                <Heading className="text-3xl break-words text-foreground sm:text-4xl">
                  {album.title}
                </Heading>

                <Box className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <Box className="flex items-center gap-1.5">
                    <CalendarIcon aria-hidden="true" className="size-4 text-primary-strong" />

                    <Text className="text-sm text-muted-foreground">{occurredOn}</Text>
                  </Box>

                  <Text className="text-sm text-muted-foreground">
                    {t('photoCount', { count: album.photoCount })}
                  </Text>
                </Box>

                {album.description && (
                  <Text className="text-base whitespace-pre-line text-muted-foreground">
                    {album.description}
                  </Text>
                )}
              </Box>

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

              {photos.length > 0 && (
                <Box className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
                  {photos.map((photo, index) => (
                    <Button
                      key={photo.id}
                      aria-label={t('openPhoto', { position: index + 1 })}
                      className="aspect-square h-auto overflow-hidden rounded-xl p-0"
                      type="button"
                      variant="ghost"
                      onClick={() => lightbox.setIndex(index)}
                    >
                      <PublicPhotoImage
                        alt={photoAlt(index + 1)}
                        className="size-full"
                        photo={photo}
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                      />
                    </Button>
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
                  {isLoadingMore ? t('loadingMore') : t('loadMore')}
                </Button>
              )}

              <PhotoLightbox
                albumTitle={album.title}
                hasNext={lightbox.hasNext}
                index={lightbox.index}
                photos={photos}
                total={album.photoCount}
                onIndexChange={lightbox.setIndex}
                onNext={lightbox.showNext}
              />
            </>
          )}
        </Box>
      </Box>

      <AppFooter />
    </Box>
  );
};
