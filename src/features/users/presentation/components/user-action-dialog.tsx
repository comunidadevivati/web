import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Spinner,
} from '@/components/ui';
import type { UserActionRequest } from '@/features/users/presentation/models/users.model';
import { PowerIcon, PowerOffIcon, Trash2Icon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const actionIcons = {
  suspend: PowerOffIcon,
  reactivate: PowerIcon,
  delete: Trash2Icon,
};

type UserActionDialogProps = {
  // Ação em confirmação; null mantém o diálogo fechado.
  request: UserActionRequest | null;
  isPending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

// Confirmação de suspender, reativar ou excluir definitivamente uma conta.
export const UserActionDialog = ({
  isPending,
  onCancel,
  onConfirm,
  request,
}: UserActionDialogProps) => {
  const { t } = useTranslation('users');

  const action = request?.action ?? 'suspend';

  const Icon = actionIcons[action];

  return (
    <Dialog
      open={request !== null}
      onOpenChange={(nextOpen) => {
        // Durante o envio, o diálogo só fecha pelo resultado da request.
        if (!nextOpen && !isPending) {
          onCancel();
        }
      }}
    >
      <DialogContent
        className="gap-6 p-5 sm:max-w-md sm:p-6"
        closeDisabled={isPending}
        closeLabel={t('confirm.cancel')}
      >
        <DialogHeader className="pr-8">
          <DialogTitle className="text-xl font-semibold tracking-tight">
            {t(`confirm.${action}.title`, { name: request?.user.name ?? '' })}
          </DialogTitle>

          <DialogDescription>{t(`confirm.${action}.description`)}</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose
            render={
              <Button
                className="h-11 w-full sm:w-auto sm:px-5"
                disabled={isPending}
                type="button"
                variant="outline"
              />
            }
          >
            {t('confirm.cancel')}
          </DialogClose>

          <Button
            aria-busy={isPending}
            autoFocus
            className="h-11 w-full sm:w-auto sm:px-5"
            disabled={isPending}
            type="button"
            variant={action === 'reactivate' ? 'default' : 'destructive'}
            onClick={onConfirm}
          >
            {isPending ? <Spinner data-icon="inline-start" /> : <Icon data-icon="inline-start" />}
            {isPending ? t('confirm.confirming') : t(`actions.${action}`)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
