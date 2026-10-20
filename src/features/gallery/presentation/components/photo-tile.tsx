import { StatusBadge } from '@/components/molecules';
import { Box, Button, Image, Spinner, Text } from '@/components/ui';
import type { Photo } from '@/features/gallery/domain/gallery';
import { photoStatusTones } from '@/features/gallery/presentation/models/gallery.model';
import { Trash2Icon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type PhotoTileProps = {
  photo: Photo;
  // Texto alternativo já traduzido.
  alt: string;
  disabled: boolean;
  onDelete: (photo: Photo) => void;
};

// Miniatura de uma foto no painel: o placeholder borrado ocupa o espaço enquanto a miniatura
// (URL de validade curta) carrega; fotos em processamento ou com falha mostram a situação.
export const PhotoTile = ({ alt, disabled, onDelete, photo }: PhotoTileProps) => {
  const { t } = useTranslation('gallery');

  const { failure, height, placeholder, previewUrl, status, width } = photo;

  return (
    <Box
      className="
        relative aspect-square overflow-hidden rounded-xl border border-border bg-muted bg-cover
        bg-center
      "
      style={placeholder ? { backgroundImage: `url("${placeholder}")` } : undefined}
    >
      {previewUrl && (
        <Image
          alt={alt}
          className="size-full object-cover"
          decoding="async"
          height={height ?? undefined}
          loading="lazy"
          src={previewUrl}
          width={width ?? undefined}
        />
      )}

      {status !== 'READY' && (
        <Box
          className="
            absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/80 p-3
            text-center
          "
        >
          {status === 'PROCESSING' && <Spinner className="size-6 text-primary-strong" />}

          <StatusBadge label={t(`photoStatus.${status}`)} tone={photoStatusTones[status]} />

          {failure && <Text className="text-xs">{t(`photoFailure.${failure}`)}</Text>}
        </Box>
      )}

      <Button
        aria-label={t('actions.delete')}
        className="absolute top-2 right-2 shadow-sm"
        disabled={disabled}
        size="icon-sm"
        type="button"
        variant="secondary"
        onClick={() => onDelete(photo)}
      >
        <Trash2Icon />
      </Button>
    </Box>
  );
};
