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
import { PublicAlbumCard } from '@/features/photos/presentation/components/public-album-card';
import { usePublicAlbumsViewModel } from '@/features/photos/presentation/view-models/public-albums.view-model';
import { cn } from '@/lib/utils';
import { CircleAlertIcon, RefreshCwIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Página pública /fotos: álbuns publicados dos cultos e eventos.
export const PublicAlbumsView = () => {
  const { albums, hasNextPage, isLoading, isLoadingMore, isRetrying, loadMore, notice, retry } =
    usePublicAlbumsViewModel();

  const { t } = useTranslation('photos');

  return (
    <Box className="flex min-h-dvh flex-col overflow-x-clip bg-background">
      <PublicHeader />

      <Box className="flex-1" role="main">
        <Box
          className="
            mx-auto grid w-full max-w-360 gap-8 px-4 py-10 sm:gap-10 sm:px-6 sm:py-12 lg:px-8
            lg:py-16
          "
        >
          <Box className="grid max-w-2xl gap-3">
            <Text
              className="
                text-xs font-semibold tracking-widest text-primary-strong uppercase sm:text-sm
              "
            >
              {t('eyebrow')}
            </Text>

            <Heading className="text-3xl text-foreground sm:text-4xl lg:text-5xl">
              {t('title')}
            </Heading>

            <Text className="text-base text-muted-foreground sm:text-lg">{t('description')}</Text>
          </Box>

          {isLoading && (
            <Box className="flex min-h-48 items-center justify-center">
              <Spinner className="size-8 text-primary-strong" />
            </Box>
          )}

          {notice && (
            <Alert variant="destructive">
              <CircleAlertIcon />

              <AlertTitle>{t('notices.unavailable.title')}</AlertTitle>

              <AlertDescription className="grid gap-3">
                {t('notices.unavailable.description')}

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
              </AlertDescription>
            </Alert>
          )}

          {!isLoading && !notice && albums.length === 0 && (
            <Text className="py-10 text-center text-muted-foreground">{t('empty')}</Text>
          )}

          {albums.length > 0 && (
            <Box className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {albums.map(({ album, occurredOn }) => (
                <PublicAlbumCard key={album.slug} album={album} occurredOn={occurredOn} />
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
        </Box>
      </Box>

      <AppFooter />
    </Box>
  );
};
