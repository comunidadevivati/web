import type { TranslationKey } from '@/app/i18n/translation-key';
import type { StatusBadgeTone } from '@/components/molecules';
import type { UploadUpdate } from '@/features/gallery/application/use-cases/upload-photos.use-case';
import {
  ACCEPTED_PHOTO_TYPES,
  GalleryAccessDeniedError,
  GalleryConflictError,
  GalleryNotFoundError,
  InvalidGalleryDataError,
  type Album,
  type AlbumDetails,
  type AlbumStatus,
  type AlbumStatusAction,
  type PhotoStatus,
} from '@/features/gallery/domain/gallery';
import { z } from 'zod';

// Limites da Core API.
export const ALBUM_TITLE_MAX_LENGTH = 120;

export const ALBUM_DESCRIPTION_MAX_LENGTH = 2000;

// Atributo accept do seletor de arquivos.
export const PHOTO_FILE_ACCEPT = ACCEPTED_PHOTO_TYPES.join(',');

export const albumStatusTones: Record<AlbumStatus, StatusBadgeTone> = {
  DRAFT: 'warning',
  PUBLISHED: 'success',
  ARCHIVED: 'neutral',
};

// Transições oferecidas no painel para cada status do álbum.
export const albumStatusActions: Record<AlbumStatus, AlbumStatusAction[]> = {
  DRAFT: ['publish', 'archive'],
  PUBLISHED: ['unpublish'],
  ARCHIVED: ['restore'],
};

export const photoStatusTones: Record<PhotoStatus, StatusBadgeTone> = {
  PROCESSING: 'warning',
  READY: 'success',
  FAILED: 'neutral',
};

// Falhas exibidas em Alert nos formulários e em toast nas ações.
export type GalleryNotice =
  | 'invalidData'
  | 'conflict'
  | 'notFound'
  | 'accessDenied'
  | 'unavailable';

export const getGalleryNotice = (error: Error): GalleryNotice => {
  if (error instanceof InvalidGalleryDataError) {
    return 'invalidData';
  }

  if (error instanceof GalleryConflictError) {
    return 'conflict';
  }

  if (error instanceof GalleryNotFoundError) {
    return 'notFound';
  }

  if (error instanceof GalleryAccessDeniedError) {
    return 'accessDenied';
  }

  return 'unavailable';
};

// Explicação do servidor para um conflito (ex.: álbum arquivado), quando houver.
export const getConflictDetail = (error: Error | null) => {
  return error instanceof GalleryConflictError ? error.detail : undefined;
};

// Mensagens de validação: chaves de tradução do namespace "gallery".
export const galleryValidationMessages = {
  titleRequired: 'validation.titleRequired',
  titleInvalid: 'validation.titleInvalid',
  occurredOnInvalid: 'validation.occurredOnInvalid',
  descriptionInvalid: 'validation.descriptionInvalid',
  invalid: 'validation.invalid',
} as const satisfies Record<string, TranslationKey<'gallery'>>;

const messages = galleryValidationMessages;

// Data civil de hoje (AAAA-MM-DD) no fuso do navegador.
export const getTodayIsoDate = () => {
  return new Date().toLocaleDateString('en-CA');
};

const isValidOccurrenceDate = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00Z`);

  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value &&
    value >= '2000-01-01' &&
    value <= getTodayIsoDate()
  );
};

export const albumFormSchema = z.object({
  title: z
    .string()
    .trim()
    .transform((value) => value.replace(/\s+/g, ' '))
    .pipe(
      z.string().min(1, messages.titleRequired).max(ALBUM_TITLE_MAX_LENGTH, messages.titleInvalid),
    ),
  occurredOn: z
    .string()
    .trim()
    .refine((value) => isValidOccurrenceDate(value), messages.occurredOnInvalid),
  description: z
    .string()
    .trim()
    .max(ALBUM_DESCRIPTION_MAX_LENGTH, messages.descriptionInvalid)
    .transform((value) => (value === '' ? null : value)),
});

export type AlbumFormInput = z.input<typeof albumFormSchema>;

export type AlbumFormData = z.output<typeof albumFormSchema>;

export const toAlbumDetails = (data: AlbumFormData): AlbumDetails => data;

export const toAlbumFormInput = (album: Album | null): AlbumFormInput => ({
  title: album?.title ?? '',
  occurredOn: album?.occurredOn ?? getTodayIsoDate(),
  description: album?.description ?? '',
});

// Arquivo selecionado no painel e o andamento do envio. O arquivo fica guardado para o reenvio.
export type UploadItem = UploadUpdate & {
  key: string;
  name: string;
  file: File;
};

export const isFinishedUpload = ({ stage }: UploadItem) => {
  return stage === 'done' || stage === 'failed';
};

// Só falhas passageiras (rede ou serviço fora do ar) valem novo envio; formato, tamanho e recusas
// do servidor falhariam de novo.
export const isRetryableUpload = ({ failure, stage }: UploadItem) => {
  return stage === 'failed' && (failure === 'transfer' || failure === 'unavailable');
};

// Data civil ISO exibida no idioma atual, sem deslocamento de fuso.
export const formatCivilDate = (iso: string, locale: string) => {
  return new Intl.DateTimeFormat(locale, { timeZone: 'UTC', dateStyle: 'long' }).format(
    new Date(`${iso}T00:00:00Z`),
  );
};
