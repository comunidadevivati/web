import { Box, Heading, Text } from '@/components/ui';
import type { PublicAlbum } from '@/features/photos/domain/public-gallery';
import { PublicPhotoImage } from '@/features/photos/presentation/components/public-photo-image';
import { Link } from '@tanstack/react-router';
import { CalendarIcon, ImagesIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type PublicAlbumCardProps = {
  album: PublicAlbum;
  // Data já formatada no idioma atual.
  occurredOn: string;
};

// Cartão de um álbum na lista do site: capa, título, data e quantidade de fotos.
export const PublicAlbumCard = ({ album, occurredOn }: PublicAlbumCardProps) => {
  const { t } = useTranslation('photos');

  return (
    <Link
      className="
        group grid overflow-hidden rounded-xl border border-border surface-card shadow-sm
        transition-shadow duration-200 hover:shadow-elevated focus-visible:ring-2
        focus-visible:ring-primary focus-visible:outline-none
      "
      params={{ slug: album.slug }}
      to="/fotos/$slug"
    >
      <Box className="aspect-4/3 overflow-hidden bg-muted">
        {album.cover ? (
          <PublicPhotoImage
            alt=""
            className="
              size-full transition-transform duration-300 group-hover:scale-[1.03]
              motion-reduce:transition-none motion-reduce:group-hover:scale-100
            "
            photo={album.cover}
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
          />
        ) : (
          <Box className="flex size-full items-center justify-center text-muted-foreground">
            <ImagesIcon aria-hidden="true" className="size-10" />
          </Box>
        )}
      </Box>

      <Box className="grid gap-1.5 p-4">
        <Heading className="text-lg font-semibold break-words text-foreground" level={2}>
          {album.title}
        </Heading>

        <Box className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <Box className="flex items-center gap-1.5">
            <CalendarIcon aria-hidden="true" className="size-3.5 text-primary-strong" />

            <Text className="text-sm">{occurredOn}</Text>
          </Box>

          <Text className="text-sm">{t('photoCount', { count: album.photoCount })}</Text>
        </Box>
      </Box>
    </Link>
  );
};
