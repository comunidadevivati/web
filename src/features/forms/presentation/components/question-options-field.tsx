import { Box, Button, Input, Label, Text } from '@/components/ui';
import {
  MAX_QUESTION_OPTIONS,
  MIN_QUESTION_OPTIONS,
  QUESTION_OPTION_MAX_LENGTH,
  type ChoiceFieldType,
} from '@/features/forms/domain/form';
import {
  createEmptyOption,
  type FormEditorData,
  type FormEditorInput,
} from '@/features/forms/presentation/models/forms.model';
import { ChevronDownIcon, CircleIcon, PlusIcon, SquareIcon, XIcon } from 'lucide-react';
import { useFieldArray, type Control, type UseFormRegister } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

// Marcador de cada opção no editor, conforme o tipo.
const OPTION_MARKERS = {
  CHECKBOX: SquareIcon,
  RADIO: CircleIcon,
  SELECT: ChevronDownIcon,
} as const;

type QuestionOptionsFieldProps = {
  control: Control<FormEditorInput, unknown, FormEditorData>;
  register: UseFormRegister<FormEditorInput>;
  questionIndex: number;
  // CHECKBOX: quem responde marca várias opções; RADIO e SELECT (lista): marca só uma.
  fieldType: ChoiceFieldType;
  disabled: boolean;
  // Erros já traduzidos: o de cada opção e o da lista (quantidade ou repetição).
  getOptionError: (optionIndex: number) => string | undefined;
  listError?: string;
};

// Lista editável das opções de uma pergunta de escolha: de 1 a 20 rótulos, na ordem de exibição.
export const QuestionOptionsField = ({
  control,
  disabled,
  fieldType,
  getOptionError,
  listError,
  questionIndex,
  register,
}: QuestionOptionsFieldProps) => {
  const { t } = useTranslation('forms');

  const { append, fields, remove } = useFieldArray({
    control,
    name: `questions.${questionIndex}.options`,
    keyName: 'key',
  });

  const prefix = `form-question-${questionIndex}-option`;

  const listId = `form-question-${questionIndex}-options`;

  const MarkerIcon = OPTION_MARKERS[fieldType];

  return (
    <Box
      aria-describedby={listError ? `${listId}-error` : `${listId}-hint`}
      aria-label={t('options.groupLabel', { number: questionIndex + 1 })}
      className="grid gap-3"
      role="group"
    >
      <Box className="grid gap-1">
        <Text className="text-sm font-medium text-foreground">{t('options.title')}</Text>

        <Text className="text-xs text-muted-foreground" id={`${listId}-hint`}>
          {t(`options.hints.${fieldType}`)}
        </Text>
      </Box>

      {fields.map(({ key }, optionIndex) => {
        const id = `${prefix}-${optionIndex}`;

        const error = getOptionError(optionIndex);

        return (
          <Box key={key} className="grid gap-1">
            <Box className="flex items-center gap-2">
              <MarkerIcon aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />

              <Label className="sr-only" htmlFor={id}>
                {t('options.label', { number: optionIndex + 1 })}
              </Label>

              <Input
                id={id}
                aria-describedby={error ? `${id}-error` : undefined}
                aria-invalid={Boolean(error)}
                aria-required
                autoComplete="off"
                disabled={disabled}
                maxLength={QUESTION_OPTION_MAX_LENGTH}
                placeholder={t('options.placeholder', { number: optionIndex + 1 })}
                type="text"
                {...register(`questions.${questionIndex}.options.${optionIndex}.label`)}
              />

              <Button
                aria-label={t('options.remove', { number: optionIndex + 1 })}
                className="size-10 shrink-0"
                disabled={disabled || fields.length <= MIN_QUESTION_OPTIONS}
                size="icon"
                type="button"
                variant="ghost"
                onClick={() => remove(optionIndex)}
              >
                <XIcon />
              </Button>
            </Box>

            {error && (
              <Text className="pl-6 text-sm text-destructive-strong" id={`${id}-error`}>
                {error}
              </Text>
            )}
          </Box>
        );
      })}

      {listError && (
        <Text className="text-sm text-destructive-strong" id={`${listId}-error`} role="alert">
          {listError}
        </Text>
      )}

      <Button
        className="h-10 w-full px-4 sm:w-fit"
        disabled={disabled || fields.length >= MAX_QUESTION_OPTIONS}
        type="button"
        variant="outline"
        onClick={() => append(createEmptyOption(), { shouldFocus: true })}
      >
        <PlusIcon data-icon="inline-start" />
        {t('options.add')}
      </Button>
    </Box>
  );
};
