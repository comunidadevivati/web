import { Image } from '@/components/ui';
import type { PublicPhoto } from '@/features/photos/domain/public-gallery';
import { fallbackSrc, toSrcSet } from '@/features/photos/presentation/models/public-gallery.model';
import { cn } from '@/lib/utils';

type PublicPhotoImageProps = {
  photo: PublicPhoto;
  alt: string;
  // Largura exibida (atributo sizes), para o navegador escolher a variante.
  sizes: string;
  className?: string;
  loading?: 'eager' | 'lazy';
};

// Foto publicada em AVIF (quando suportado) ou WebP, na variante adequada à largura exibida. O
// placeholder borrado ocupa o espaço enquanto a imagem carrega.
export const PublicPhotoImage = ({
  alt,
  className,
  loading = 'lazy',
  photo,
  sizes,
}: PublicPhotoImageProps) => {
  return (
    <picture
      className={cn('block bg-muted bg-cover bg-center', className)}
      style={photo.placeholder ? { backgroundImage: `url("${photo.placeholder}")` } : undefined}
    >
      <source sizes={sizes} srcSet={toSrcSet(photo.variants, 'avif')} type="image/avif" />

      <source sizes={sizes} srcSet={toSrcSet(photo.variants, 'webp')} type="image/webp" />

      <Image
        alt={alt}
        className="size-full object-cover"
        decoding="async"
        height={photo.height}
        loading={loading}
        src={fallbackSrc(photo)}
        width={photo.width}
      />
    </picture>
  );
};
