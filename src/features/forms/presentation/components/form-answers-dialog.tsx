import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Text,
} from '@/components/ui';
import type { AnswerRow } from '@/features/forms/presentation/models/form-responses.model';
import { FileTextIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type FormAnswersDialogProps = {
  // Respostas abertas; null mantém o diálogo fechado.
  answers: {
    recipientName: string;
    recipientEmail: string;
    answeredAt: string;
    rows: AnswerRow[];
  } | null;
  onClose: () => void;
  onOpenPdf: () => void;
};

// Respostas digitais de uma pessoa (pelo link). "Abrir PDF" abre o PDF das respostas numa nova aba,
// no visualizador do navegador (ler, baixar ou imprimir).
export const FormAnswersDialog = ({ answers, onClose, onOpenPdf }: FormAnswersDialogProps) => {
  const { t } = useTranslation('forms');

  return (
    <Dialog
      open={answers !== null}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
    >
      <DialogContent
        className="max-h-[calc(100dvh-2rem)] gap-6 overflow-y-auto p-5 sm:max-w-2xl sm:p-6"
        closeLabel={t('responses.answersDialog.close')}
      >
        <DialogHeader className="pr-8">
          <DialogTitle className="text-xl font-semibold tracking-tight">
            {answers?.recipientName ?? ''}
          </DialogTitle>

          <DialogDescription>
            {t('responses.answersDialog.description', {
              email: answers?.recipientEmail ?? '',
              date: answers?.answeredAt ?? '',
            })}
          </DialogDescription>
        </DialogHeader>

        <Box className="grid gap-4">
          {answers?.rows.map(({ optionLabels, questionId, text, title }, index) => (
            <Box key={questionId} className="grid gap-1 border-t border-border pt-3">
              <Text className="text-sm font-semibold text-foreground">
                {index + 1}. {title}
              </Text>

              {text && <Text className="text-sm whitespace-pre-line">{text}</Text>}

              {optionLabels.map((label) => (
                <Text key={label} className="text-sm">
                  • {label}
                </Text>
              ))}

              {!text && optionLabels.length === 0 && (
                <Text className="text-sm text-muted-foreground italic">
                  {t('responses.answersDialog.noAnswer')}
                </Text>
              )}
            </Box>
          ))}
        </Box>

        <DialogFooter>
          <Button
            className="h-11 w-full sm:w-auto sm:px-5"
            type="button"
            variant="outline"
            onClick={onClose}
          >
            {t('responses.answersDialog.close')}
          </Button>

          <Button className="h-11 w-full sm:w-auto sm:px-5" type="button" onClick={onOpenPdf}>
            <FileTextIcon data-icon="inline-start" />
            {t('responses.answersDialog.print')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
