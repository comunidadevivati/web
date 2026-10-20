import type { TranslationKey } from '@/app/i18n/translation-key';
import { authSessionQueryOptions } from '@/features/auth/application/queries/auth-session.query';
import { GALLERY_QUERY_KEY } from '@/features/gallery/application/queries/gallery.query';
import { saveAlbumUseCase } from '@/features/gallery/application/use-cases/save-album.use-case';
import {
  GalleryConflictError,
  InvalidGalleryDataError,
  type Album,
} from '@/features/gallery/domain/gallery';
import {
  albumFormSchema,
  galleryValidationMessages,
  getConflictDetail,
  getGalleryNotice,
  toAlbumDetails,
  toAlbumFormInput,
  type AlbumFormData,
  type AlbumFormInput,
} from '@/features/gallery/presentation/models/gallery.model';
import { notify } from '@/shared/feedback/notify';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

// Motivo informado pelo Dialog quando o fechamento vem do botão "X".
const CLOSE_BUTTON_REASON = 'close-press';

const FORM_FIELDS = ['title', 'occurredOn', 'description'] as const;

type UseAlbumFormViewModelOptions = {
  // Álbum em edição; null cria um novo (rascunho).
  album: Album | null;
  onOpenChange: (open: boolean) => void;
};

export const useAlbumFormViewModel = ({ album, onOpenChange }: UseAlbumFormViewModelOptions) => {
  const { t } = useTranslation('gallery');

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { data: session } = useQuery(authSessionQueryOptions);

  const isEditing = album !== null;

  const form = useForm<AlbumFormInput, unknown, AlbumFormData>({
    resolver: zodResolver(albumFormSchema),
    defaultValues: toAlbumFormInput(album),
    mode: 'onTouched',
  });

  const {
    formState: { errors, isSubmitted, touchedFields },
    getValues,
    handleSubmit,
    reset,
    setError,
  } = form;

  const {
    error,
    isPending,
    mutate,
    reset: resetMutation,
  } = useMutation({
    mutationFn: ({ csrfToken, data }: { csrfToken: string; data: AlbumFormData }) =>
      saveAlbumUseCase({ csrfToken, album, details: toAlbumDetails(data) }),
    onSuccess: async ({ id, title }) => {
      await queryClient.invalidateQueries({ queryKey: GALLERY_QUERY_KEY });

      onOpenChange(false);

      notify.success({
        title: isEditing ? t('albumForm.success.editTitle') : t('albumForm.success.createTitle'),
        description: isEditing
          ? t('albumForm.success.editDescription', { title })
          : t('albumForm.success.createDescription', { title }),
      });

      // Recém-criado: segue para o álbum, onde as fotos são enviadas.
      if (!isEditing) {
        await navigate({ to: '/site/albuns/$albumId', params: { albumId: id } });
      }
    },
    onError: async (saveError) => {
      // Campos recusados pelo servidor ficam marcados no próprio formulário.
      if (saveError instanceof InvalidGalleryDataError) {
        saveError.fields
          .filter((field): field is (typeof FORM_FIELDS)[number] =>
            (FORM_FIELDS as readonly string[]).includes(field),
          )
          .forEach((field) => {
            setError(field, { type: 'server', message: galleryValidationMessages.invalid });
          });
      }

      // Na edição, um conflito indica dados desatualizados: fecha e recarrega.
      if (saveError instanceof GalleryConflictError && isEditing) {
        onOpenChange(false);

        notify.error({
          title: t('notices.conflict.title'),
          description: getConflictDetail(saveError) ?? t('notices.conflict.description'),
        });

        await queryClient.invalidateQueries({ queryKey: GALLERY_QUERY_KEY });
      }
    },
  });

  const notice = error ? getGalleryNotice(error) : null;

  // O erro aparece depois do envio ou ao sair de um campo preenchido.
  const getFieldError = (name: (typeof FORM_FIELDS)[number]) => {
    const message = errors[name]?.message;

    const isVisible = isSubmitted || (Boolean(touchedFields[name]) && Boolean(getValues(name)));

    return message && isVisible ? t(message as TranslationKey<'gallery'>) : undefined;
  };

  const fieldErrors = {
    title: getFieldError('title'),
    occurredOn: getFieldError('occurredOn'),
    description: getFieldError('description'),
  };

  // O modal só fecha pelo botão "X" e nunca durante o envio.
  const handleOpenChange = (open: boolean, reason?: string) => {
    if (!open && (isPending || reason !== CLOSE_BUTTON_REASON)) {
      return;
    }

    onOpenChange(open);
  };

  // Descarta o que não foi salvo depois que o modal termina de fechar.
  const handleOpenChangeComplete = (open: boolean) => {
    if (open) {
      return;
    }

    reset();

    resetMutation();
  };

  const submit = handleSubmit((data) => {
    if (isPending || !session) {
      return;
    }

    mutate({ csrfToken: session.csrfToken, data });
  });

  return {
    fieldErrors,
    form,
    handleOpenChange,
    handleOpenChangeComplete,
    isEditing,
    isSubmitting: isPending,
    notice,
    noticeDetail: getConflictDetail(error),
    submit,
  };
};
