import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Dropzone,
  Spinner,
  Text,
} from '@/components/ui';
import type { PaperAttachmentIssue } from '@/features/forms/domain/form-response';
import { PAPER_ATTACHMENT_ACCEPT } from '@/features/forms/presentation/models/form-responses.model';
import { FileCheckIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Motivo informado pelo Dialog quando o fechamento vem do botão "X".
const CLOSE_BUTTON_REASON = 'close-press';

const INPUT_ID = 'paper-answer-file';

type PaperAnswerDialogProps = {
  // Convite em registro; null mantém o diálogo fechado.
  target: { recipientName: string; hasAttachment: boolean; isPaper: boolean } | null;
  // Arquivo escolhido (tamanho já formatado); aparece dentro do dropzone.
  file: { name: string; size: string } | null;
  issue: PaperAttachmentIssue | null;
  isPending: boolean;
  onSelectFile: (file: File) => void;
  onCancel: () => void;
  onConfirm: () => void;
};

// Registro de resposta em papel: marca como respondido e, opcionalmente, anexa o formulário
// preenchido digitalizado (PDF, JPG ou PNG). Para quem já está marcado, serve para anexar ou trocar.
export const PaperAnswerDialog = ({
  file,
  isPending,
  issue,
  onCancel,
  onConfirm,
  onSelectFile,
  target,
}: PaperAnswerDialogProps) => {
  const { t } = useTranslation('forms');

  const isAttachOnly = target?.isPaper ?? false;

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
        className="gap-6 p-5 sm:max-w-lg sm:p-6"
        closeDisabled={isPending}
        closeLabel={t('responses.paper.close')}
      >
        <DialogHeader className="pr-8">
          <DialogTitle className="text-xl font-semibold tracking-tight">
            {isAttachOnly ? t('responses.paper.attachTitle') : t('responses.paper.title')}
          </DialogTitle>

          <DialogDescription>
            {isAttachOnly
              ? t('responses.paper.attachDescription', { name: target?.recipientName ?? '' })
              : t('responses.paper.description', { name: target?.recipientName ?? '' })}
          </DialogDescription>
        </DialogHeader>

        <Box className="grid gap-2">
          <Text className="text-sm font-medium text-foreground" id={`${INPUT_ID}-label`}>
            {isAttachOnly ? t('responses.paper.fileRequired') : t('responses.paper.fileOptional')}
          </Text>

          <Dropzone
            id={INPUT_ID}
            accept={PAPER_ATTACHMENT_ACCEPT}
            aria-describedby={issue ? `${INPUT_ID}-error` : undefined}
            aria-labelledby={`${INPUT_ID}-label`}
            disabled={isPending}
            dragText={t('responses.paper.dropzone.drag')}
            hoverText={t('responses.paper.dropzone.hover')}
            idleText={t('responses.paper.dropzone.idle')}
            invalid={Boolean(issue)}
            preview={
              file ? (
                <Box className="flex min-h-32 w-full flex-col items-center justify-center gap-2 p-4">
                  <FileCheckIcon aria-hidden="true" className="size-8 text-primary-strong" />

                  <Text className="max-w-full truncate text-sm font-semibold text-foreground">
                    {file.name}
                  </Text>

                  <Text className="text-xs text-muted-foreground">{file.size}</Text>
                </Box>
              ) : undefined
            }
            onFileSelect={onSelectFile}
          />

          {file && (
            <Text className="text-xs text-muted-foreground">
              {t('responses.paper.selectedHint')}
            </Text>
          )}

          {target?.hasAttachment && !file && (
            <Text className="text-xs text-muted-foreground">
              {t('responses.paper.replaceHint')}
            </Text>
          )}

          {issue && (
            <Text className="text-sm text-destructive-strong" id={`${INPUT_ID}-error`} role="alert">
              {t(`responses.paper.issues.${issue}`)}
            </Text>
          )}
        </Box>

        <DialogFooter>
          <Button
            className="h-11 w-full sm:w-auto sm:px-5"
            disabled={isPending}
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            {t('responses.paper.cancel')}
          </Button>

          <Button
            aria-busy={isPending}
            className="h-11 w-full sm:w-auto sm:px-5"
            disabled={isPending || (isAttachOnly && !file)}
            type="button"
            onClick={onConfirm}
          >
            {isPending && <Spinner data-icon="inline-start" />}
            {isPending ? t('responses.paper.confirming') : t('responses.paper.confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
