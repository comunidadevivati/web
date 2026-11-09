import { FormField } from '@/components/molecules';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FieldGroup,
  Form,
  Input,
  Label,
  Radio,
  Spinner,
  Text,
  Textarea,
} from '@/components/ui';
import {
  BACKLOG_CARD_DESCRIPTION_MAX_LENGTH,
  BACKLOG_CARD_TITLE_MAX_LENGTH,
  BACKLOG_CARD_TYPES,
  type BacklogCard,
  type BacklogCardStatus,
} from '@/features/backlog/domain/backlog-card';
import {
  BacklogStatusBadge,
  BacklogTypeBadge,
} from '@/features/backlog/presentation/components/backlog-badges';
import { BacklogCardDates } from '@/features/backlog/presentation/components/backlog-card-dates';
import { useBacklogCardDialogViewModel } from '@/features/backlog/presentation/view-models/backlog-card-dialog.view-model';
import { cn } from '@/lib/utils';
import { SaveIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Motivo informado pelo Dialog quando o fechamento vem do botão "X".
const CLOSE_BUTTON_REASON = 'close-press';

const describedBy = (id: string, error?: string) => {
  return error ? `${id}-error` : undefined;
};

type BacklogCardDialogProps = {
  // Card em edição; null cria um novo.
  card: BacklogCard | null;
  // Etapa em que o card novo nasce.
  status: BacklogCardStatus;
  onClose: () => void;
};

// Criação e edição do card. As datas e a etapa não são editáveis aqui: as datas são automáticas e a
// etapa muda movendo o card no quadro. Fecha só pelo "X" ou por Cancelar, para não perder o texto.
export const BacklogCardDialog = ({ card, onClose, status }: BacklogCardDialogProps) => {
  const {
    hasValidationErrors,
    cardForm,
    changeType,
    getFieldError,
    isEditing,
    isSubmitting,
    submit,
    type,
  } = useBacklogCardDialogViewModel({ card, onClose, status });

  const { register } = cardForm;

  const { t } = useTranslation('backlog');

  const titleError = getFieldError('title');

  const descriptionError = getFieldError('description');

  return (
    <Dialog
      open
      onOpenChange={(nextOpen, { reason }) => {
        if (!nextOpen && !isSubmitting && reason === CLOSE_BUTTON_REASON) {
          onClose();
        }
      }}
    >
      <DialogContent
        className="max-h-[90dvh] gap-6 overflow-y-auto p-5 sm:max-w-lg sm:p-6"
        closeDisabled={isSubmitting}
        closeLabel={t('dialog.close')}
      >
        <DialogHeader className="pr-8">
          <DialogTitle className="text-xl font-semibold tracking-tight">
            {isEditing ? t('dialog.editTitle') : t('dialog.createTitle')}
          </DialogTitle>

          <DialogDescription>
            {isEditing
              ? t('dialog.editDescription')
              : t('dialog.createDescription', { status: t(`statuses.${status}`) })}
          </DialogDescription>
        </DialogHeader>

        <Form className="grid gap-6" noValidate onSubmit={(event) => void submit(event)}>
          <FieldGroup className="gap-4">
            <FormField error={titleError} id="backlog-card-title" label={t('fields.title')}>
              <Input
                id="backlog-card-title"
                aria-describedby={describedBy('backlog-card-title', titleError)}
                aria-invalid={Boolean(titleError)}
                aria-required
                autoComplete="off"
                disabled={isSubmitting}
                maxLength={BACKLOG_CARD_TITLE_MAX_LENGTH}
                placeholder={t('fields.titlePlaceholder')}
                type="text"
                {...register('title')}
              />
            </FormField>

            <FormField
              error={descriptionError}
              id="backlog-card-description"
              label={t('fields.description')}
            >
              <Textarea
                id="backlog-card-description"
                aria-describedby={describedBy('backlog-card-description', descriptionError)}
                aria-invalid={Boolean(descriptionError)}
                aria-required
                disabled={isSubmitting}
                maxLength={BACKLOG_CARD_DESCRIPTION_MAX_LENGTH}
                placeholder={t('fields.descriptionPlaceholder')}
                rows={5}
                {...register('description')}
              />
            </FormField>

            <Box aria-labelledby="backlog-card-type" className="grid gap-2" role="radiogroup">
              <Text className="text-sm font-medium text-foreground" id="backlog-card-type">
                {t('fields.type')}
              </Text>

              <Box className="grid gap-2 sm:grid-cols-3">
                {BACKLOG_CARD_TYPES.map((option) => {
                  const optionId = `backlog-card-type-${option}`;

                  return (
                    <Label
                      key={option}
                      className={cn(
                        `
                          flex cursor-pointer items-center gap-2 rounded-xl border border-border p-3
                          font-normal transition-colors hover:border-primary/40
                        `,
                        type === option && 'border-primary bg-primary/5',
                      )}
                      htmlFor={optionId}
                    >
                      <Radio
                        checked={type === option}
                        disabled={isSubmitting}
                        id={optionId}
                        name="backlog-card-type"
                        onChange={() => changeType(option)}
                      />

                      <BacklogTypeBadge type={option} />
                    </Label>
                  );
                })}
              </Box>
            </Box>

            {card && (
              <Box className="grid gap-2 rounded-xl border border-border p-3">
                <Box className="flex items-center justify-between gap-2">
                  <Text className="text-xs">{t('fields.status')}</Text>

                  <BacklogStatusBadge status={card.status} />
                </Box>

                <BacklogCardDates card={card} />
              </Box>
            )}
          </FieldGroup>

          <DialogFooter>
            <Button
              className="h-11 w-full sm:w-auto sm:px-5"
              disabled={isSubmitting}
              type="button"
              variant="outline"
              onClick={onClose}
            >
              {t('dialog.cancel')}
            </Button>

            <Button
              aria-busy={isSubmitting}
              className="h-11 w-full sm:w-auto sm:px-5"
              disabled={isSubmitting || hasValidationErrors}
              type="submit"
            >
              {isSubmitting ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <SaveIcon data-icon="inline-start" />
              )}
              {isSubmitting ? t('dialog.submitting') : t('dialog.submit')}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
