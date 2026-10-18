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
import { SendIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type ResendVerificationDialogProps = {
  email: string;
  isSending: boolean;
  name: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSend: () => void;
};

// Confirmação do reenvio do link de verificação para o e-mail da conta logada.
export const ResendVerificationDialog = ({
  email,
  isSending,
  name,
  open,
  onOpenChange,
  onSend,
}: ResendVerificationDialogProps) => {
  const { t } = useTranslation();

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        // Durante o envio, o diálogo só fecha pelo resultado da request.
        if (!isSending) {
          onOpenChange(nextOpen);
        }
      }}
    >
      <DialogContent
        className="gap-6 p-5 sm:max-w-md sm:p-6"
        closeDisabled={isSending}
        closeLabel={t('emailVerification.resendDialog.cancel')}
      >
        <DialogHeader className="pr-8">
          <DialogTitle className="text-xl font-semibold tracking-tight">
            {t('emailVerification.resendDialog.title')}
          </DialogTitle>

          <DialogDescription>
            {t('emailVerification.resendDialog.description', { email, name })}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose
            render={
              <Button
                className="h-11 w-full sm:w-auto sm:px-5"
                disabled={isSending}
                type="button"
                variant="outline"
              />
            }
          >
            {t('emailVerification.resendDialog.cancel')}
          </DialogClose>

          <Button
            aria-busy={isSending}
            autoFocus
            className="h-11 w-full sm:w-auto sm:px-5"
            disabled={isSending}
            type="button"
            onClick={onSend}
          >
            {isSending ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <SendIcon data-icon="inline-start" />
            )}
            {isSending
              ? t('emailVerification.resendDialog.submitting')
              : t('emailVerification.resendDialog.submit')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
