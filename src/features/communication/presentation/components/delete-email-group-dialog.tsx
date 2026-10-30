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

type DeleteEmailGroupDialogProps = {
  // Nome do grupo a excluir; null mantém o diálogo fechado.
  groupName: string | null;
  isPending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

// Confirmação da exclusão definitiva do grupo. Fecha só pelo "X" ou por Cancelar, nunca durante a
// exclusão.
export const DeleteEmailGroupDialog = ({
  groupName,
  isPending,
  onCancel,
  onConfirm,
}: DeleteEmailGroupDialogProps) => {
  const { t } = useTranslation('communication');

  return (
    <Dialog
      open={groupName !== null}
      onOpenChange={(nextOpen, { reason }) => {
        if (!nextOpen && !isPending && reason === CLOSE_BUTTON_REASON) {
          onCancel();
        }
      }}
    >
      <DialogContent
        className="gap-6 p-5 sm:max-w-md sm:p-6"
        closeDisabled={isPending}
        closeLabel={t('deleteDialog.close')}
      >
        <DialogHeader className="pr-8">
          <DialogTitle className="text-xl font-semibold tracking-tight">
            {t('deleteDialog.title')}
          </DialogTitle>

          <DialogDescription>
            {t('deleteDialog.description', { name: groupName ?? '' })}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            className="h-11 w-full sm:w-auto sm:px-5"
            disabled={isPending}
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            {t('deleteDialog.cancel')}
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
            {isPending ? t('deleteDialog.confirming') : t('deleteDialog.confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
