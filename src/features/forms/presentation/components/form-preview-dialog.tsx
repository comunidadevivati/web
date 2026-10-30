import {
  Box,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Heading,
  Image,
  Label,
  Text,
} from '@/components/ui';
import {
  QuestionAnswerField,
  type AnswerFieldQuestion,
} from '@/features/forms/presentation/components/question-answer-field';
import { CalendarRangeIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type FormPreviewDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  headerImage: { url: string; width: number; height: number } | null;
  title: string;
  description: string;
  period: string;
  questions: (AnswerFieldQuestion & { key: string })[];
  consentText: string | null;
};

// Prévia de como o formulário aparece para quem responde: imagem acima do título, descrição,
// período de validade e as perguntas com campos desabilitados.
export const FormPreviewDialog = ({
  description,
  headerImage,
  onOpenChange,
  open,
  period,
  questions,
  title,
  consentText,
}: FormPreviewDialogProps) => {
  const { t } = useTranslation('forms');

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => onOpenChange(nextOpen)}>
      <DialogContent
        className="max-h-[calc(100dvh-2rem)] gap-6 overflow-y-auto p-5 sm:max-w-[52rem] sm:p-6"
        closeLabel={t('preview.close')}
      >
        <DialogHeader className="pr-8">
          <DialogTitle className="text-sm font-semibold tracking-wide text-primary-strong uppercase">
            {t('preview.title')}
          </DialogTitle>

          <DialogDescription>{t('preview.description')}</DialogDescription>
        </DialogHeader>

        <Box className="mx-auto grid w-full max-w-200 gap-6">
          {headerImage && (
            <Image
              alt=""
              aria-hidden="true"
              className="mx-auto block h-auto max-h-150 w-auto max-w-full rounded-lg"
              height={headerImage.height}
              src={headerImage.url}
              width={headerImage.width}
            />
          )}

          <Box className="grid gap-2">
            <Heading className="text-2xl font-semibold tracking-tight text-foreground" level={2}>
              {title}
            </Heading>

            {period && (
              <Box className="flex items-center gap-1.5">
                <CalendarRangeIcon aria-hidden="true" className="size-4 text-primary-strong" />

                <Text className="text-sm">{period}</Text>
              </Box>
            )}

            {description && (
              <Text className="leading-relaxed whitespace-pre-line text-muted-foreground">
                {description}
              </Text>
            )}
          </Box>

          <Box className="grid gap-5">
            {questions.map(({ key, ...question }, index) => (
              <QuestionAnswerField
                key={key}
                disabled
                id={`preview-question-${index}`}
                index={index}
                question={question}
              />
            ))}
          </Box>

          {consentText && (
            <Box className="flex items-start gap-3 rounded-lg border border-border p-3">
              <Checkbox disabled id="preview-consent" />

              <Label className="grid gap-1 font-normal" htmlFor="preview-consent">
                <Text className="text-sm font-semibold text-foreground">
                  {t('answer.consent.label')}
                </Text>

                <Text className="text-sm whitespace-pre-line text-muted-foreground">
                  {consentText}
                </Text>
              </Label>
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};
