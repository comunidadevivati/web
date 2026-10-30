import {
  Box,
  Checkbox,
  Input,
  Label,
  Radio,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Text,
  Textarea,
} from '@/components/ui';
import {
  DEFAULT_SCALE,
  type QuestionFieldType,
  type QuestionScale,
} from '@/features/forms/domain/form';
import {
  INPUT_ANSWER_MAX_LENGTH,
  TEXTAREA_ANSWER_MAX_LENGTH,
} from '@/features/forms/domain/form-answer';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

// Rascunho da resposta de uma pergunta: texto (texto, data e número), opções ou valor da escala.
export type AnswerDraftValue = { text: string; optionIds: string[]; value: number | null };

export const EMPTY_ANSWER: AnswerDraftValue = { text: '', optionIds: [], value: null };

export type AnswerFieldQuestion = {
  title: string;
  description: string | null;
  fieldType: QuestionFieldType;
  required: boolean;
  options: { id: string; label: string }[];
  scale: QuestionScale | null;
};

type QuestionAnswerFieldProps = {
  // Prefixo dos ids dos controles (único na página).
  id: string;
  index: number;
  question: AnswerFieldQuestion;
  value?: AnswerDraftValue;
  onChange?: (next: AnswerDraftValue) => void;
  onBlur?: () => void;
  disabled: boolean;
  error?: string;
};

// Campo de resposta de uma pergunta, conforme o tipo: usado na página de resposta e, desabilitado, na
// pré-visualização do editor.
export const QuestionAnswerField = ({
  disabled,
  error,
  id,
  index,
  onBlur,
  onChange,
  question: { description, fieldType, options, required, scale, title },
  value = EMPTY_ANSWER,
}: QuestionAnswerFieldProps) => {
  const { t } = useTranslation('forms');

  const hintId = description ? `${id}-hint` : undefined;

  const errorId = error ? `${id}-error` : undefined;

  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  const change = (next: Partial<AnswerDraftValue>) => onChange?.({ ...value, ...next });

  const isGroup = fieldType === 'CHECKBOX' || fieldType === 'RADIO' || fieldType === 'SCALE';

  const heading = (
    <>
      {index + 1}. {title}
      {required && (
        <Text aria-hidden="true" className="ml-1 text-destructive-strong">
          *
        </Text>
      )}
      {required && <Text className="sr-only"> {t('answer.requiredSr')}</Text>}
    </>
  );

  const renderControl = () => {
    switch (fieldType) {
      case 'CHECKBOX':

      case 'RADIO':
        return (
          <Box className="grid gap-2">
            {options.map((option, optionIndex) => {
              const optionId = `${id}-option-${optionIndex}`;

              const isChecked = value.optionIds.includes(option.id);

              return (
                <Box key={option.id} className="flex items-center gap-3">
                  {fieldType === 'RADIO' ? (
                    <Radio
                      checked={isChecked}
                      disabled={disabled}
                      id={optionId}
                      name={id}
                      onBlur={onBlur}
                      onChange={() => change({ optionIds: [option.id] })}
                    />
                  ) : (
                    <Checkbox
                      checked={isChecked}
                      disabled={disabled}
                      id={optionId}
                      onBlur={onBlur}
                      onChange={() =>
                        change({
                          optionIds: isChecked
                            ? value.optionIds.filter((selected) => selected !== option.id)
                            : [...value.optionIds, option.id],
                        })
                      }
                    />
                  )}

                  <Label className="font-normal" htmlFor={optionId}>
                    {option.label}
                  </Label>
                </Box>
              );
            })}
          </Box>
        );

      case 'SELECT': {
        const items = options.map(({ id: optionId, label }) => ({ value: optionId, label }));

        return (
          <Select
            disabled={disabled}
            items={items}
            value={value.optionIds[0] ?? null}
            onValueChange={(next) => change({ optionIds: next ? [next as string] : [] })}
          >
            <SelectTrigger
              id={id}
              aria-describedby={describedBy}
              aria-invalid={Boolean(error)}
              onBlur={onBlur}
            >
              <SelectValue placeholder={t('answer.selectPlaceholder')} />
            </SelectTrigger>

            <SelectContent>
              {items.map(({ label, value: optionId }) => (
                <SelectItem key={optionId} value={optionId}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }

      case 'SCALE': {
        const { max, maxLabel, min, minLabel, pointLabels } = scale ?? DEFAULT_SCALE;

        return (
          <Box className="grid gap-2">
            <Box className="flex flex-wrap gap-2">
              {Array.from({ length: max - min + 1 }, (_, offset) => min + offset).map((number) => {
                const optionId = `${id}-value-${number}`;

                const isChecked = value.value === number;

                // Com nomes por ponto, cada opção mostra o número e o nome embaixo.
                const pointLabel = pointLabels?.[number - min];

                return (
                  <Label
                    key={number}
                    className={cn(
                      `
                        flex cursor-pointer items-center justify-center rounded-lg border
                        border-border text-sm font-semibold transition-colors
                        hover:border-primary/50 has-focus-visible:ring-3
                        has-focus-visible:ring-ring/50
                      `,
                      pointLabel ? 'min-h-14 min-w-20 flex-col gap-0.5 px-3 py-2' : 'size-11',
                      isChecked && 'border-primary bg-primary text-primary-foreground',
                      disabled && 'cursor-not-allowed opacity-70',
                    )}
                    htmlFor={optionId}
                  >
                    <Radio
                      checked={isChecked}
                      className="sr-only"
                      disabled={disabled}
                      id={optionId}
                      name={id}
                      onBlur={onBlur}
                      onChange={() => change({ value: number })}
                    />
                    {number}
                    {pointLabel && (
                      <Text
                        className={cn(
                          'text-center text-xs font-normal',
                          isChecked ? 'text-primary-foreground' : 'text-muted-foreground',
                        )}
                      >
                        {pointLabel}
                      </Text>
                    )}
                  </Label>
                );
              })}
            </Box>

            {!pointLabels && (minLabel || maxLabel) && (
              <Box className="flex justify-between gap-4 text-xs text-muted-foreground">
                <Text>{minLabel ? `${min} = ${minLabel}` : ''}</Text>

                <Text className="text-right">{maxLabel ? `${max} = ${maxLabel}` : ''}</Text>
              </Box>
            )}
          </Box>
        );
      }

      case 'TEXTAREA':
        return (
          <Textarea
            id={id}
            aria-describedby={describedBy}
            aria-invalid={Boolean(error)}
            aria-required={required}
            disabled={disabled}
            maxLength={TEXTAREA_ANSWER_MAX_LENGTH}
            placeholder={t('preview.answerPlaceholder')}
            rows={4}
            value={value.text}
            onBlur={onBlur}
            onChange={({ target }) => change({ text: target.value })}
          />
        );

      default:
        return (
          <Input
            id={id}
            aria-describedby={describedBy}
            aria-invalid={Boolean(error)}
            aria-required={required}
            className={cn(fieldType !== 'INPUT' && 'sm:max-w-xs')}
            disabled={disabled}
            inputMode={fieldType === 'NUMBER' ? 'decimal' : undefined}
            maxLength={fieldType === 'INPUT' ? INPUT_ANSWER_MAX_LENGTH : undefined}
            placeholder={fieldType === 'INPUT' ? t('preview.answerPlaceholder') : undefined}
            step={fieldType === 'NUMBER' ? 'any' : undefined}
            type={INPUT_TYPES[fieldType] ?? 'text'}
            value={value.text}
            onBlur={onBlur}
            onChange={({ target }) => change({ text: target.value })}
          />
        );
    }
  };

  return (
    <Box
      aria-describedby={isGroup ? describedBy : undefined}
      aria-labelledby={isGroup ? `${id}-label` : undefined}
      className="grid gap-2"
      role={isGroup ? (fieldType === 'CHECKBOX' ? 'group' : 'radiogroup') : undefined}
    >
      {isGroup ? (
        <Text className="text-sm leading-snug font-medium text-foreground" id={`${id}-label`}>
          {heading}
        </Text>
      ) : (
        <Label htmlFor={id}>{heading}</Label>
      )}

      {description && (
        <Text className="text-xs text-muted-foreground" id={hintId}>
          {description}
        </Text>
      )}

      {renderControl()}

      {error && (
        <Text className="text-sm text-destructive-strong" id={errorId}>
          {error}
        </Text>
      )}
    </Box>
  );
};

const INPUT_TYPES: Partial<Record<QuestionFieldType, string>> = {
  INPUT: 'text',
  DATE: 'date',
  NUMBER: 'number',
};
