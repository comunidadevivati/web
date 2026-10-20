import { StatusBadge } from '@/components/molecules';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Box,
  Button,
  Card,
  CardContent,
  Heading,
  Spinner,
  Text,
} from '@/components/ui';
import { albumStatusTones } from '@/features/gallery/presentation/models/gallery.model';
import { useAlbumsViewModel } from '@/features/gallery/presentation/view-models/albums.view-model';
import { AlbumFormView } from '@/features/gallery/presentation/views/album-form.view';
import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';
import {
  CalendarIcon,
  ChevronRightIcon,
  CircleAlertIcon,
  ImagesIcon,
  PlusIcon,
  RefreshCwIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const AlbumsView = () => {
  const {
    createFormKey,
    errorNotice,
    hasNextPage,
    isCreateOpen,
    isLoading,
    isLoadingMore,
    isRetrying,
    items,
    loadMore,
    openCreate,
    retry,
    setIsCreateOpen,
  } = useAlbumsViewModel();

  const { t } = useTranslation('gallery');

  const hasItems = items.length > 0;

  return (
    <Box className="grid gap-6">
      <Box className="flex flex-wrap items-end justify-between gap-4">
        <Box>
          <Heading className="text-2xl font-semibold tracking-tight text-foreground">
            {t('listPage.title')}
          </Heading>

          <Text className="mt-1 text-muted-foreground">{t('listPage.subtitle')}</Text>
        </Box>

        <Button className="h-11 w-full sm:w-auto sm:px-5" type="button" onClick={openCreate}>
          <PlusIcon data-icon="inline-start" />
          {t('listPage.create')}
        </Button>
      </Box>

      {isLoading && (
        <Box className="flex min-h-64 items-center justify-center">
          <Spinner className="size-8 text-primary-strong" />
        </Box>
      )}

      {errorNotice && !hasItems && (
        <Alert variant="destructive">
          <CircleAlertIcon />

          <AlertTitle>{t(`notices.${errorNotice}.title`)}</AlertTitle>

          <AlertDescription className="grid gap-3">
            {t(`notices.${errorNotice}.description`)}

            {errorNotice !== 'accessDenied' && (
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

      {!isLoading && !errorNotice && !hasItems && (
        <Card className="border-border surface-card shadow-sm">
          <CardContent className="flex flex-col items-center gap-3 py-10">
            <ImagesIcon aria-hidden="true" className="size-8 text-primary-strong" />

            <Text className="text-center">{t('listPage.empty')}</Text>
          </CardContent>
        </Card>
      )}

      {hasItems && (
        <Box className="grid gap-3 lg:grid-cols-2">
          {items.map(({ album, occurredOn, photoCount }) => (
            <Link
              key={album.id}
              className="
                group relative flex items-center gap-4 overflow-hidden rounded-xl border
                border-border surface-card p-4 shadow-sm transition-all duration-200
                hover:border-primary/30 hover:shadow-md
              "
              params={{ albumId: album.id }}
              to="/site/albuns/$albumId"
            >
              <Box
                aria-hidden="true"
                className="
                  flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10
                  text-primary-strong
                "
              >
                <ImagesIcon className="size-5" />
              </Box>

              <Box className="grid min-w-0 flex-1 gap-1.5">
                <Box className="flex flex-wrap items-center gap-2">
                  <Text className="truncate text-sm font-semibold text-foreground">
                    {album.title}
                  </Text>

                  <StatusBadge
                    label={t(`status.${album.status}`)}
                    tone={albumStatusTones[album.status]}
                  />
                </Box>

                <Box className="flex flex-wrap gap-x-4 gap-y-1">
                  <Box className="flex items-center gap-1.5">
                    <CalendarIcon aria-hidden="true" className="size-3.5 text-primary-strong" />

                    <Text className="text-xs">{occurredOn}</Text>
                  </Box>

                  <Text className="text-xs">{photoCount}</Text>
                </Box>
              </Box>

              <ChevronRightIcon
                aria-hidden="true"
                className="
                  size-5 shrink-0 text-muted-foreground transition-transform
                  group-hover:translate-x-0.5
                "
              />
            </Link>
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

      <AlbumFormView
        key={createFormKey}
        album={null}
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />
    </Box>
  );
};
