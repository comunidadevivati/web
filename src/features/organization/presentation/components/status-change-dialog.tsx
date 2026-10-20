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
import type { StatusChangeRequest } from '@/features/organization/presentation/models/organization.model';
import { PowerIcon, PowerOffIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const descriptionKeys = {
  organization: {
    activate: 'statusDialog.organizationActivate',
    deactivate: 'statusDialog.organizationDeactivate',
  },
  congregation: {
    activate: 'statusDialog.congregationActivate',
    deactivate: 'statusDialog.congregationDeactivate',
  },
} as const;

type StatusChangeDialogProps = {
  // Pedido em confirmação; null mantém o diálogo fechado.
  request: StatusChangeRequest | null;
  isPending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

// Confirmação de ativação ou inativação da organização ou de uma congregação.
export const StatusChangeDialog = ({
  isPending,
  onCancel,
  onConfirm,
  request,
}: StatusChangeDialogProps) => {
  const { t } = useTranslation('organization');

  const action = request?.action ?? 'activate';

  const target = request?.congregationId ? 'congregation' : 'organization';

  const Icon = action === 'activate' ? PowerIcon : PowerOffIcon;

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
        closeLabel={t('statusDialog.cancel')}
      >
        <DialogHeader className="pr-8">
          <DialogTitle className="text-xl font-semibold tracking-tight">
            {t(`statusDialog.${action}Title`, { name: request?.name ?? '' })}
          </DialogTitle>

          <DialogDescription>{t(descriptionKeys[target][action])}</DialogDescription>
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
            {t('statusDialog.cancel')}
          </DialogClose>

          <Button
            aria-busy={isPending}
            autoFocus
            className="h-11 w-full sm:w-auto sm:px-5"
            disabled={isPending}
            type="button"
            variant={action === 'deactivate' ? 'destructive' : 'default'}
            onClick={onConfirm}
          >
            {isPending ? <Spinner data-icon="inline-start" /> : <Icon data-icon="inline-start" />}
            {isPending ? t('statusDialog.confirming') : t(`actions.${action}`)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
