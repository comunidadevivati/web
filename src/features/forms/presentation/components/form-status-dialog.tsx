import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Label,
  Spinner,
  Text,
  Textarea,
} from '@/components/ui';
import { CONSENT_TEXT_MAX_LENGTH } from '@/features/forms/domain/form';
import {
  isEmailAction,
  type FormMenuAction,
} from '@/features/forms/presentation/models/forms.model';
import { useTranslation } from 'react-i18next';

// Motivo informado pelo Dialog quando o fechamento vem do botão "X".
const CLOSE_BUTTON_REASON = 'close-press';

// Concluir e cancelar não têm volta: o botão de confirmação fica destrutivo.
const IRREVERSIBLE_ACTIONS: FormMenuAction[] = ['finish', 'cancel', 'purgeAnswers'];

type FormStatusDialogProps = {
  // Formulário e ação a confirmar; null mantém o diálogo fechado.
  target: { title: string; action: FormMenuAction } | null;
  // Mensagem opcional incluída nos e-mails (somente nas ações de envio).
  message: string;
  onMessageChange: (message: string) => void;
  isPending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

// Confirmação das ações do menu da lista: mudanças de status (publicar, despublicar, concluir e
// cancelar) e envio dos e-mails aos grupos. Fecha só pelo "X" ou por Voltar, nunca durante o envio.
export const FormStatusDialog = ({
  isPending,
  message,
  onCancel,
  onConfirm,
  onMessageChange,
  target,
}: FormStatusDialogProps) => {
  const { t } = useTranslation('forms');

  const action = target?.action ?? 'publish';

  const isIrreversible = IRREVERSIBLE_ACTIONS.includes(action);

  return (
    <Dialog
      open={target !== null}
      onOpenChange={(nextOpen, { reason }) => {
        if (!nextOpen && !isPending && reason === CLOSE_BUTTON_REASON) {
          onCancel();
        }
      }}
    >
      <DialogContent
        className="gap-6 p-5 sm:max-w-md sm:p-6"
        closeDisabled={isPending}
        closeLabel={t('statusDialog.close')}
      >
        <DialogHeader className="pr-8">
          <DialogTitle className="text-xl font-semibold tracking-tight">
            {t(`statusActions.${action}.title`)}
          </DialogTitle>

          <DialogDescription>
            {t(`statusActions.${action}.description`, { title: target?.title ?? '' })}
          </DialogDescription>
        </DialogHeader>

        {isEmailAction(action) && (
          <Box className="grid gap-2">
            <Label htmlFor="form-dispatch-message">{t('statusDialog.message')}</Label>

            <Textarea
              id="form-dispatch-message"
              aria-describedby="form-dispatch-message-hint"
              disabled={isPending}
              maxLength={CONSENT_TEXT_MAX_LENGTH}
              placeholder={t('statusDialog.messagePlaceholder')}
              rows={3}
              value={message}
              onChange={({ target: { value } }) => onMessageChange(value)}
            />

            <Text className="text-xs text-muted-foreground" id="form-dispatch-message-hint">
              {t('statusDialog.messageHint')}
            </Text>
          </Box>
        )}

        <DialogFooter>
          <Button
            className="h-11 w-full sm:w-auto sm:px-5"
            disabled={isPending}
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            {t('statusDialog.back')}
          </Button>

          <Button
            aria-busy={isPending}
            autoFocus
            className="h-11 w-full sm:w-auto sm:px-5"
            disabled={isPending}
            type="button"
            variant={isIrreversible ? 'destructive' : 'default'}
            onClick={onConfirm}
          >
            {isPending && <Spinner data-icon="inline-start" />}
            {isPending ? t('statusDialog.confirming') : t(`statusActions.${action}.confirm`)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
