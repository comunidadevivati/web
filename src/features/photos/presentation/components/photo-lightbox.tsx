import { Box, Button, Dialog, DialogContent, DialogTitle, Text } from '@/components/ui';
import type { PublicPhoto } from '@/features/photos/domain/public-gallery';
import { PublicPhotoImage } from '@/features/photos/presentation/components/public-photo-image';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type PhotoLightboxProps = {
  photos: PublicPhoto[];
  // Posição aberta; null fecha o visualizador.
  index: number | null;
  // Total de fotos do álbum (pode haver páginas ainda não carregadas).
  total: number;
  albumTitle: string;
  hasNext: boolean;
  onIndexChange: (index: number | null) => void;
  onNext: () => void;
};

// Visualizador em tela cheia: foto inteira (sem corte), anterior/próxima pelos botões e pelas
// setas do teclado.
export const PhotoLightbox = ({
  albumTitle,
  hasNext,
  index,
  onIndexChange,
  onNext,
  photos,
  total,
}: PhotoLightboxProps) => {
  const { t } = useTranslation('photos');

  const photo = index === null ? undefined : photos[index];

  const hasPrevious = index !== null && index > 0;

  const goPrevious = () => {
    if (hasPrevious) {
      onIndexChange(index - 1);
    }
  };

  return (
    <Dialog
      open={photo !== undefined}
      onOpenChange={(open) => {
        if (!open) {
          onIndexChange(null);
        }
      }}
    >
      <DialogContent
        className="
          h-[calc(100dvh-2rem)] max-w-[calc(100%-2rem)] grid-rows-[auto_1fr] bg-header p-3
          text-header-foreground ring-header-border sm:max-w-[calc(100%-4rem)] sm:p-4
        "
        closeLabel={t('lightbox.close')}
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft') {
            goPrevious();
          }

          if (event.key === 'ArrowRight' && hasNext) {
            onNext();
          }
        }}
      >
        <Box className="flex min-w-0 items-center gap-3 pr-10">
          <DialogTitle className="truncate text-sm font-medium text-header-foreground">
            {albumTitle}
          </DialogTitle>

          {index !== null && (
            <Text className="shrink-0 text-xs text-header-foreground/70">
              {t('lightbox.position', { position: index + 1, total })}
            </Text>
          )}
        </Box>

        {photo && (
          <Box className="relative min-h-0">
            <PublicPhotoImage
              key={photo.id}
              alt={t('photoAlt', { position: (index ?? 0) + 1, title: albumTitle })}
              className="size-full bg-contain bg-no-repeat [&_img]:object-contain"
              loading="eager"
              photo={photo}
              sizes="100vw"
            />

            <Button
              aria-label={t('lightbox.previous')}
              className="absolute top-1/2 left-1 -translate-y-1/2 sm:left-2"
              disabled={!hasPrevious}
              size="icon"
              type="button"
              variant="secondary"
              onClick={goPrevious}
            >
              <ChevronLeftIcon />
            </Button>

            <Button
              aria-label={t('lightbox.next')}
              className="absolute top-1/2 right-1 -translate-y-1/2 sm:right-2"
              disabled={!hasNext}
              size="icon"
              type="button"
              variant="secondary"
              onClick={onNext}
            >
              <ChevronRightIcon />
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};
