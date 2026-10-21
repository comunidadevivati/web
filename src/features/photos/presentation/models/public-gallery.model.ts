import {
  PublicAlbumNotFoundError,
  type PublicPhoto,
  type PublicPhotoVariant,
} from '@/features/photos/domain/public-gallery';

// Falhas exibidas nas páginas públicas.
export type PublicGalleryNotice = 'notFound' | 'unavailable';

export const getPublicGalleryNotice = (error: Error): PublicGalleryNotice => {
  return error instanceof PublicAlbumNotFoundError ? 'notFound' : 'unavailable';
};

// srcset de um formato: "url 320w, url 640w, ...".
export const toSrcSet = (variants: readonly PublicPhotoVariant[], format: 'avif' | 'webp') => {
  return variants.map((variant) => `${variant[format]} ${variant.width}w`).join(', ');
};

// Imagem padrão do <img> (navegadores sem srcset): a maior variante WebP.
export const fallbackSrc = (photo: PublicPhoto) => {
  return photo.variants.at(-1)?.webp;
};

// Data civil ISO exibida no idioma atual, sem deslocamento de fuso.
export const formatOccurredOn = (iso: string, locale: string) => {
  return new Intl.DateTimeFormat(locale, { timeZone: 'UTC', dateStyle: 'long' }).format(
    new Date(`${iso}T00:00:00Z`),
  );
};
