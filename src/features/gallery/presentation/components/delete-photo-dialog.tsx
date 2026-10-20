import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Spinner,
} from '@/components/ui';
import { Trash2Icon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Motivo informado pelo Dialog quando o fechamento vem do botão "X".
const CLOSE_BUTTON_REASON = 'close-press';

type DeletePhotoDialogProps = {
  open: boolean;
  isPending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

// Confirmação da exclusão definitiva. Fecha só pelo "X" ou por Cancelar, nunca durante a exclusão.
export const DeletePhotoDialog = ({
  isPending,
  onCancel,
  onConfirm,
  open,
}: DeletePhotoDialogProps) => {
  const { t } = useTranslation('gallery');

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen, { reason }) => {
        if (!nextOpen && !isPending && reason === CLOSE_BUTTON_REASON) {
          onCancel();
        }
      }}
    >
      <DialogContent
        className="gap-6 p-5 sm:max-w-md sm:p-6"
        closeDisabled={isPending}
        closeLabel={t('confirmDelete.close')}
      >
        <DialogHeader className="pr-8">
          <DialogTitle className="text-xl font-semibold tracking-tight">
            {t('confirmDelete.title')}
          </DialogTitle>

          <DialogDescription>{t('confirmDelete.description')}</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            className="h-11 w-full sm:w-auto sm:px-5"
            disabled={isPending}
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            {t('confirmDelete.cancel')}
          </Button>

          <Button
            aria-busy={isPending}
            autoFocus
            className="h-11 w-full sm:w-auto sm:px-5"
            disabled={isPending}
            type="button"
            variant="destructive"
            onClick={onConfirm}
          >
            {isPending ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <Trash2Icon data-icon="inline-start" />
            )}
            {isPending ? t('confirmDelete.confirming') : t('confirmDelete.confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
