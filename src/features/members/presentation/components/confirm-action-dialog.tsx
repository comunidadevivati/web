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
import { useTranslation } from 'react-i18next';

// Textos já traduzidos da confirmação em andamento.
export type ConfirmActionContent = {
  title: string;
  description: string;
  confirmLabel: string;
  // Ação que retira algo de uso (inativar, arquivar, encerrar): botão destrutivo.
  isDestructive: boolean;
};

type ConfirmActionDialogProps = {
  // Conteúdo da confirmação; null mantém o diálogo fechado.
  content: ConfirmActionContent | null;
  isPending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

// Confirmação das mudanças de situação do membro e dos vínculos.
export const ConfirmActionDialog = ({
  content,
  isPending,
  onCancel,
  onConfirm,
}: ConfirmActionDialogProps) => {
  const { t } = useTranslation('members');

  return (
    <Dialog
      open={content !== null}
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
            {content?.title}
          </DialogTitle>

          <DialogDescription>{content?.description}</DialogDescription>
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
            variant={content?.isDestructive ? 'destructive' : 'default'}
            onClick={onConfirm}
          >
            {isPending && <Spinner data-icon="inline-start" />}
            {isPending ? t('confirm.confirming') : content?.confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
