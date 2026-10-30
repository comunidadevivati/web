import { FormField } from '@/components/molecules';
import {
  Box,
  Button,
  Checkbox,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import {
  SCALE_LABEL_MAX_LENGTH,
  SCALE_MAX_VALUE,
  SCALE_MIN_VALUES,
} from '@/features/forms/domain/form';
import type {
  FormEditorData,
  FormEditorInput,
} from '@/features/forms/presentation/models/forms.model';
import { SparklesIcon } from 'lucide-react';
import {
  Controller,
  useWatch,
  type Control,
  type UseFormRegister,
  type UseFormSetValue,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export type ScaleField = 'min' | 'max' | 'minLabel' | 'maxLabel' | `pointLabels.${number}`;

type QuestionScaleFieldProps = {
  control: Control<FormEditorInput, unknown, FormEditorData>;
  register: UseFormRegister<FormEditorInput>;
  setValue: UseFormSetValue<FormEditorInput>;
  questionIndex: number;
  disabled: boolean;
  getError: (field: ScaleField) => string | undefined;
};

// Modelo de desempenho de 1 a 5, aplicado pelo atalho.
const PERFORMANCE_PRESET = ['terrible', 'bad', 'fair', 'good', 'excellent'] as const;

const toItems = (values: readonly number[]) =>
  values.map((value) => ({ value: String(value), label: String(value) }));

// Configuração da escala: valor inicial (0 ou 1), final (até 10) e rótulos opcionais das pontas
// (ex.: "Discordo totalmente" e "Concordo totalmente") ou um nome para cada ponto (ex.: Péssimo,
// Ruim, Regular, Bom, Ótimo).
export const QuestionScaleField = ({
  control,
  disabled,
  getError,
  questionIndex,
  register,
  setValue,
}: QuestionScaleFieldProps) => {
  const { t } = useTranslation('forms');

  const prefix = `form-question-${questionIndex}-scale`;

  const path = `questions.${questionIndex}.scale` as const;

  const { max, min, namedPoints } = useWatch({ control, name: path });

  const minItems = toItems(SCALE_MIN_VALUES);

  const maxItems = toItems(
    Array.from({ length: SCALE_MAX_VALUE - min }, (_, index) => min + 1 + index),
  );

  const points = Array.from({ length: Math.max(max - min + 1, 0) }, (_, offset) => min + offset);

  const applyPerformancePreset = () => {
    const options = { shouldDirty: true, shouldValidate: true };

    setValue(`${path}.min`, 1, options);

    setValue(`${path}.max`, PERFORMANCE_PRESET.length, options);

    setValue(`${path}.namedPoints`, true, options);

    setValue(
      `${path}.pointLabels`,
      PERFORMANCE_PRESET.map((key) => t(`scale.preset.${key}`)),
      options,
    );
  };

  const selectField = (name: 'min' | 'max', items: { value: string; label: string }[]) => (
    <FormField error={getError(name)} id={`${prefix}-${name}`} label={t(`scale.${name}`)}>
      <Controller
        control={control}
        name={`${path}.${name}`}
        render={({ field: { onBlur, onChange, value } }) => (
          <Select
            disabled={disabled}
            items={items}
            value={String(value)}
            onValueChange={(next) => onChange(Number(next ?? value))}
          >
            <SelectTrigger id={`${prefix}-${name}`} onBlur={onBlur}>
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {items.map(({ label, value: option }) => (
                <SelectItem key={option} value={option}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </FormField>
  );

  const labelField = (name: 'minLabel' | 'maxLabel') => (
    <FormField error={getError(name)} id={`${prefix}-${name}`} label={t(`scale.${name}`)}>
      <Input
        id={`${prefix}-${name}`}
        autoComplete="off"
        disabled={disabled}
        maxLength={SCALE_LABEL_MAX_LENGTH}
        placeholder={t(`scale.${name}Placeholder`)}
        type="text"
        {...register(`${path}.${name}`)}
      />
    </FormField>
  );

  return (
    <Box
      aria-label={t('scale.groupLabel', { number: questionIndex + 1 })}
      className="grid gap-4"
      role="group"
    >
      <Box className="grid gap-4 sm:grid-cols-2">
        {selectField('min', minItems)}

        {selectField('max', maxItems)}
      </Box>

      <Box className="flex flex-wrap items-center justify-between gap-3">
        <Label
          className="flex w-fit cursor-pointer items-center gap-2 font-normal"
          htmlFor={`${prefix}-named-points`}
        >
          <Checkbox
            disabled={disabled}
            id={`${prefix}-named-points`}
            {...register(`${path}.namedPoints`)}
          />
          {t('scale.namedPoints')}
        </Label>

        <Button
          disabled={disabled}
          size="sm"
          type="button"
          variant="outline"
          onClick={applyPerformancePreset}
        >
          <SparklesIcon />
          {t('scale.preset.apply')}
        </Button>
      </Box>

      {namedPoints ? (
        <Box className="grid gap-4 sm:grid-cols-3">
          {points.map((value, offset) => (
            <FormField
              key={value}
              error={getError(`pointLabels.${offset}`)}
              id={`${prefix}-point-${value}`}
              label={t('scale.pointLabel', { value })}
            >
              <Input
                id={`${prefix}-point-${value}`}
                autoComplete="off"
                disabled={disabled}
                maxLength={SCALE_LABEL_MAX_LENGTH}
                type="text"
                {...register(`${path}.pointLabels.${offset}`)}
              />
            </FormField>
          ))}
        </Box>
      ) : (
        <Box className="grid gap-4 sm:grid-cols-2">
          {labelField('minLabel')}

          {labelField('maxLabel')}
        </Box>
      )}
    </Box>
  );
};
