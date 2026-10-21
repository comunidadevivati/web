import { StatusBadge } from '@/components/molecules';
import { Box, Button, Image, Spinner, Text } from '@/components/ui';
import type { Photo } from '@/features/gallery/domain/gallery';
import { photoStatusTones } from '@/features/gallery/presentation/models/gallery.model';
import { EyeOffIcon, GlobeIcon, StarIcon, Trash2Icon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type PhotoTileProps = {
  photo: Photo;
  // Texto alternativo já traduzido.
  alt: string;
  disabled: boolean;
  isCover: boolean;
  // Ação de publicação ou de capa em andamento nesta foto.
  isBusy: boolean;
  canPublish: boolean;
  canUnpublish: boolean;
  onDelete: (photo: Photo) => void;
  onTogglePublication: (photo: Photo) => void;
  onSetCover: (photo: Photo) => void;
};

// Miniatura de uma foto no painel: o placeholder borrado ocupa o espaço enquanto a miniatura
// (URL de validade curta) carrega; fotos em processamento ou com falha mostram a situação. Fotos
// prontas podem ser publicadas no site e, publicadas, virar a capa do álbum.
export const PhotoTile = ({
  alt,
  canPublish,
  canUnpublish,
  disabled,
  isBusy,
  isCover,
  onDelete,
  onSetCover,
  onTogglePublication,
  photo,
}: PhotoTileProps) => {
  const { t } = useTranslation('gallery');

  const { failure, height, placeholder, previewUrl, publishedAt, status, width } = photo;

  const isPublished = publishedAt !== null;

  const PublicationIcon = isPublished ? EyeOffIcon : GlobeIcon;

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

      {(isPublished || isCover) && (
        <Box className="absolute top-2 left-2 flex flex-wrap gap-1">
          {isPublished && <StatusBadge label={t('publication.photo.badge')} tone="success" />}

          {isCover && <StatusBadge label={t('publication.cover.badge')} tone="neutral" />}
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

      {status === 'READY' && (
        <Box
          className="
            absolute inset-x-0 bottom-0 flex flex-wrap justify-end gap-1.5 bg-linear-to-t
            from-background/90 to-transparent p-2 pt-6
          "
        >
          {isPublished && !isCover && (
            <Button
              aria-label={t('publication.cover.setFor', { alt })}
              disabled={!canPublish || isBusy}
              size="xs"
              type="button"
              variant="secondary"
              onClick={() => onSetCover(photo)}
            >
              <StarIcon data-icon="inline-start" />
              {t('publication.cover.set')}
            </Button>
          )}

          <Button
            aria-label={t(
              isPublished ? 'publication.photo.unpublishFor' : 'publication.photo.publishFor',
              { alt },
            )}
            disabled={(isPublished ? !canUnpublish : !canPublish) || isBusy}
            size="xs"
            type="button"
            variant={isPublished ? 'secondary' : 'default'}
            onClick={() => onTogglePublication(photo)}
          >
            {isBusy ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <PublicationIcon data-icon="inline-start" />
            )}
            {t(isPublished ? 'publication.photo.unpublish' : 'publication.photo.publish')}
          </Button>
        </Box>
      )}
    </Box>
  );
};
