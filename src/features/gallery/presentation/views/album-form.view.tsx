import { FormField } from '@/components/molecules';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FieldGroup,
  Form,
  Input,
  Spinner,
  Textarea,
} from '@/components/ui';
import type { Album } from '@/features/gallery/domain/gallery';
import {
  ALBUM_DESCRIPTION_MAX_LENGTH,
  ALBUM_TITLE_MAX_LENGTH,
  getTodayIsoDate,
} from '@/features/gallery/presentation/models/gallery.model';
import { useAlbumFormViewModel } from '@/features/gallery/presentation/view-models/album-form.view-model';
import { CircleAlertIcon, SaveIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type AlbumFormViewProps = {
  // Álbum em edição; null cria um novo (rascunho).
  album: Album | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const describedBy = (id: string, error?: string) => {
  return error ? `${id}-error` : undefined;
};

// Modal de criação ou edição dos dados do álbum. O endereço público (slug) não muda na edição.
export const AlbumFormView = ({ album, onOpenChange, open }: AlbumFormViewProps) => {
  const {
    fieldErrors,
    form,
    handleOpenChange,
    handleOpenChangeComplete,
    isEditing,
    isSubmitting,
    notice,
    noticeDetail,
    submit,
  } = useAlbumFormViewModel({ album, onOpenChange });

  const { register } = form;

  const { t } = useTranslation('gallery');

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen, { reason }) => handleOpenChange(nextOpen, reason)}
      onOpenChangeComplete={handleOpenChangeComplete}
    >
      <DialogContent
        className="max-h-[calc(100dvh-2rem)] gap-6 overflow-y-auto p-5 sm:max-w-lg sm:p-6"
        closeDisabled={isSubmitting}
        closeLabel={t('albumForm.close')}
      >
        <DialogHeader className="pr-8">
          <DialogTitle className="text-xl font-semibold tracking-tight">
            {isEditing ? t('albumForm.editTitle') : t('albumForm.createTitle')}
          </DialogTitle>

          <DialogDescription>
            {isEditing
              ? t('albumForm.editDescription', { title: album?.title ?? '' })
              : t('albumForm.createDescription')}
          </DialogDescription>
        </DialogHeader>

        <Form className="grid gap-6" noValidate onSubmit={submit}>
          <FieldGroup className="gap-4">
            <FormField error={fieldErrors.title} id="album-title" label={t('fields.title')}>
              <Input
                id="album-title"
                aria-describedby={describedBy('album-title', fieldErrors.title)}
                aria-invalid={Boolean(fieldErrors.title)}
                aria-required
                autoComplete="off"
                maxLength={ALBUM_TITLE_MAX_LENGTH}
                placeholder={t('fields.titlePlaceholder')}
                type="text"
                {...register('title')}
              />
            </FormField>

            <FormField
              error={fieldErrors.occurredOn}
              id="album-occurred-on"
              label={t('fields.occurredOn')}
            >
              <Input
                id="album-occurred-on"
                aria-describedby={describedBy('album-occurred-on', fieldErrors.occurredOn)}
                aria-invalid={Boolean(fieldErrors.occurredOn)}
                aria-required
                autoComplete="off"
                max={getTodayIsoDate()}
                min="2000-01-01"
                type="date"
                {...register('occurredOn')}
              />
            </FormField>

            <FormField
              error={fieldErrors.description}
              id="album-description"
              label={t('fields.description')}
            >
              <Textarea
                id="album-description"
                aria-describedby={describedBy('album-description', fieldErrors.description)}
                aria-invalid={Boolean(fieldErrors.description)}
                maxLength={ALBUM_DESCRIPTION_MAX_LENGTH}
                placeholder={t('fields.descriptionPlaceholder')}
                rows={4}
                {...register('description')}
              />
            </FormField>
          </FieldGroup>

          {notice && (
            <Alert variant="destructive">
              <CircleAlertIcon />

              <AlertTitle>{t(`notices.${notice}.title`)}</AlertTitle>

              <AlertDescription>
                {noticeDetail ?? t(`notices.${notice}.description`)}
              </AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button
              aria-busy={isSubmitting}
              className="h-11 w-full sm:w-auto sm:px-5"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <SaveIcon data-icon="inline-start" />
              )}
              {isSubmitting ? t('albumForm.submitting') : t('albumForm.submit')}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
