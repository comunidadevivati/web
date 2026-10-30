import type { TranslationKey } from '@/app/i18n/translation-key';
import type { StatusBadgeTone } from '@/components/molecules';
import {
  ACCEPTED_HEADER_IMAGE_EXTENSIONS,
  ACCEPTED_HEADER_IMAGE_TYPES,
  FORM_DESCRIPTION_MAX_LENGTH,
  FORM_STATUSES,
  FORM_TITLE_MAX_LENGTH,
  FormAccessDeniedError,
  FormConflictError,
  FormNotFoundError,
  InvalidFormDataError,
  MAX_QUESTIONS,
  QUESTION_DESCRIPTION_MAX_LENGTH,
  QUESTION_FIELD_TYPES,
  QUESTION_OPTION_MAX_LENGTH,
  QUESTION_TITLE_MAX_LENGTH,
  CONSENT_TEXT_MAX_LENGTH,
  DEFAULT_SCALE,
  SCALE_LABEL_MAX_LENGTH,
  SCALE_MAX_VALUE,
  checkQuestionOptions,
  isChoiceFieldType,
  type Form,
  type FormDetails,
  type FormEmailAction,
  type FormStatus,
  type FormStatusAction,
  type QuestionScale,
} from '@/features/forms/domain/form';
import { z } from 'zod';

// Atributo accept do seletor da imagem do cabeçalho.
export const HEADER_IMAGE_ACCEPT = [
  ...ACCEPTED_HEADER_IMAGE_TYPES,
  ...ACCEPTED_HEADER_IMAGE_EXTENSIONS,
].join(',');

export const formStatusTones: Record<FormStatus, StatusBadgeTone> = {
  DRAFT: 'warning',
  PUBLISHED: 'success',
  FINISHED: 'neutral',
  CANCELLED: 'neutral',
};

// Ações do menu de um formulário que pedem confirmação: status, envio dos e-mails e apagar respostas.
export type FormMenuAction = FormStatusAction | FormEmailAction | 'purgeAnswers';

export const isEmailAction = (action: FormMenuAction): action is FormEmailAction =>
  action === 'sendEmails' || action === 'resendEmails' || action === 'remindPending';

// Filtro da lista: um status ou todos.
export type FormStatusFilter = FormStatus | 'ALL';

export const FORM_STATUS_FILTERS: FormStatusFilter[] = ['ALL', ...FORM_STATUSES];

// Falhas exibidas em Alert (carregamento) e em toast (ações).
export type FormsNotice = 'invalidData' | 'conflict' | 'notFound' | 'accessDenied' | 'unavailable';

export const getFormsNotice = (error: Error): FormsNotice => {
  if (error instanceof InvalidFormDataError) {
    return 'invalidData';
  }

  if (error instanceof FormConflictError) {
    return 'conflict';
  }

  if (error instanceof FormNotFoundError) {
    return 'notFound';
  }

  if (error instanceof FormAccessDeniedError) {
    return 'accessDenied';
  }

  return 'unavailable';
};

// Explicação do servidor para um conflito ou recusa, quando houver.
export const getServerDetail = (error: Error | null) => {
  return error instanceof FormConflictError ? error.detail : undefined;
};

// Mensagens de validação: chaves de tradução do namespace "forms".
export const formsValidationMessages = {
  titleRequired: 'validation.titleRequired',
  titleTooLong: 'validation.titleTooLong',
  descriptionTooLong: 'validation.descriptionTooLong',
  dateInvalid: 'validation.dateInvalid',
  endsBeforeStart: 'validation.endsBeforeStart',
  endsInPast: 'validation.endsInPast',
  questionsRequired: 'validation.questionsRequired',
  questionsTooMany: 'validation.questionsTooMany',
  questionTitleRequired: 'validation.questionTitleRequired',
  questionTitleTooLong: 'validation.questionTitleTooLong',
  questionDescriptionTooLong: 'validation.questionDescriptionTooLong',
  recipientsRequired: 'validation.recipientsRequired',
  optionRequired: 'validation.optionRequired',
  optionTooLong: 'validation.optionTooLong',
  optionsTooFew: 'validation.optionsTooFew',
  optionsTooMany: 'validation.optionsTooMany',
  optionsDuplicated: 'validation.optionsDuplicated',
  scaleInvalid: 'validation.scaleInvalid',
  scaleLabelTooLong: 'validation.scaleLabelTooLong',
  scalePointRequired: 'validation.scalePointRequired',
  scalePointsDuplicated: 'validation.scalePointsDuplicated',
  consentTooLong: 'validation.consentTooLong',
  anonymousEdit: 'validation.anonymousEdit',
  invalid: 'validation.invalid',
} as const satisfies Record<string, TranslationKey<'forms'>>;

const messages = formsValidationMessages;

// Data civil de hoje (AAAA-MM-DD) no fuso do navegador.
export const getTodayIsoDate = () => {
  return new Date().toLocaleDateString('en-CA');
};

const isValidIsoDate = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00Z`);

  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

const singleLine = (max: number, requiredMessage: string, tooLongMessage: string) => {
  return z
    .string()
    .trim()
    .transform((value) => value.replace(/\s+/g, ' '))
    .pipe(z.string().min(1, requiredMessage).max(max, tooLongMessage));
};

const optionalText = (max: number, tooLongMessage: string) => {
  return z
    .string()
    .trim()
    .max(max, tooLongMessage)
    .transform((value) => (value === '' ? null : value));
};

const optionsIssueMessages = {
  tooFew: messages.optionsTooFew,
  tooMany: messages.optionsTooMany,
  duplicated: messages.optionsDuplicated,
};

const optionSchema = z.object({
  // id da opção já salva; vazio para uma opção nova.
  optionId: z.string(),
  label: singleLine(QUESTION_OPTION_MAX_LENGTH, messages.optionRequired, messages.optionTooLong),
});

// As opções só valem para checkbox e radio: nos tipos de texto ficam guardadas (caso o tipo volte a
// ser de escolha) e não são validadas nem enviadas.
// Escala com nome em cada ponto: todos preenchidos, até 40 caracteres e sem repetir.
const validatePointLabels = (
  scale: { min: number; max: number; pointLabels: (string | undefined)[] },
  context: z.RefinementCtx,
) => {
  const labels = toPointLabels(scale);

  const seen = new Set<string>();

  labels.forEach((label, offset) => {
    const normalized = label.toLocaleLowerCase();

    const message = (() => {
      if (label === '') {
        return messages.scalePointRequired;
      }

      if (label.length > SCALE_LABEL_MAX_LENGTH) {
        return messages.scaleLabelTooLong;
      }

      return seen.has(normalized) ? messages.scalePointsDuplicated : null;
    })();

    seen.add(normalized);

    if (message) {
      context.addIssue({ code: 'custom', path: ['scale', 'pointLabels', offset], message });
    }
  });
};

const questionSchema = z
  .object({
    // id da pergunta já salva; vazio para uma pergunta nova.
    questionId: z.string(),
    title: singleLine(
      QUESTION_TITLE_MAX_LENGTH,
      messages.questionTitleRequired,
      messages.questionTitleTooLong,
    ),
    description: optionalText(QUESTION_DESCRIPTION_MAX_LENGTH, messages.questionDescriptionTooLong),
    fieldType: z.enum(QUESTION_FIELD_TYPES),
    required: z.boolean(),
    options: z.array(z.object({ optionId: z.string(), label: z.string() })),
    // Configuração da escala: sempre presente no editor, validada e enviada só no tipo SCALE.
    scale: z.object({
      min: z.number(),
      max: z.number(),
      minLabel: z.string(),
      maxLabel: z.string(),
      // Nome em cada ponto: os campos acompanham min..max (posições novas chegam vazias).
      namedPoints: z.boolean(),
      pointLabels: z.array(z.string().optional()),
    }),
  })
  .superRefine(({ fieldType, options, scale }, context) => {
    if (fieldType === 'SCALE') {
      if (scale.min !== 0 && scale.min !== 1) {
        context.addIssue({
          code: 'custom',
          path: ['scale', 'min'],
          message: messages.scaleInvalid,
        });
      }

      if (scale.max <= scale.min || scale.max > SCALE_MAX_VALUE) {
        context.addIssue({
          code: 'custom',
          path: ['scale', 'max'],
          message: messages.scaleInvalid,
        });
      }

      (['minLabel', 'maxLabel'] as const).forEach((key) => {
        if (scale[key].trim().length > SCALE_LABEL_MAX_LENGTH) {
          context.addIssue({
            code: 'custom',
            path: ['scale', key],
            message: messages.scaleLabelTooLong,
          });
        }
      });

      if (scale.namedPoints) {
        validatePointLabels(scale, context);
      }
    }

    if (!isChoiceFieldType(fieldType)) {
      return;
    }

    options.forEach((option, index) => {
      const parsed = optionSchema.safeParse(option);

      parsed.error?.issues.forEach(({ message, path }) => {
        context.addIssue({ code: 'custom', path: ['options', index, ...path], message });
      });
    });

    const issue = checkQuestionOptions(
      fieldType,
      options.map(({ label }) => label.trim()),
    );

    if (issue && issue !== 'notAllowed') {
      context.addIssue({ code: 'custom', path: ['options'], message: optionsIssueMessages[issue] });
    }
  });

export const formEditorSchema = z
  .object({
    title: singleLine(FORM_TITLE_MAX_LENGTH, messages.titleRequired, messages.titleTooLong),
    description: optionalText(FORM_DESCRIPTION_MAX_LENGTH, messages.descriptionTooLong),
    startsOn: z.string().refine(isValidIsoDate, messages.dateInvalid),
    endsOn: z.string().refine(isValidIsoDate, messages.dateInvalid),
    status: z.enum(FORM_STATUSES),
    questions: z
      .array(questionSchema)
      .min(1, messages.questionsRequired)
      .max(MAX_QUESTIONS, messages.questionsTooMany),
    recipientGroupIds: z.array(z.string()),
    anonymous: z.boolean(),
    allowAnswerEdit: z.boolean(),
    consentText: optionalText(CONSENT_TEXT_MAX_LENGTH, messages.consentTooLong),
  })
  .superRefine(
    ({ allowAnswerEdit, anonymous, endsOn, recipientGroupIds, startsOn, status }, context) => {
      if (isValidIsoDate(startsOn) && isValidIsoDate(endsOn) && endsOn < startsOn) {
        context.addIssue({ code: 'custom', path: ['endsOn'], message: messages.endsBeforeStart });
      }

      // Resposta anônima não pode ser localizada depois para edição.
      if (anonymous && allowAnswerEdit) {
        context.addIssue({
          code: 'custom',
          path: ['allowAnswerEdit'],
          message: messages.anonymousEdit,
        });
      }

      // Publicar exige destinatários e um período ainda em vigor (o envio dos e-mails é à parte).
      if (status !== 'PUBLISHED') {
        return;
      }

      if (recipientGroupIds.length === 0) {
        context.addIssue({
          code: 'custom',
          path: ['recipientGroupIds'],
          message: messages.recipientsRequired,
        });
      }

      if (isValidIsoDate(endsOn) && endsOn < getTodayIsoDate()) {
        context.addIssue({ code: 'custom', path: ['endsOn'], message: messages.endsInPast });
      }
    },
  );

export type FormEditorInput = z.input<typeof formEditorSchema>;

export type FormEditorData = z.output<typeof formEditorSchema>;

export type QuestionInput = FormEditorInput['questions'][number];

export type OptionInput = QuestionInput['options'][number];

// Nomes dos pontos de min a max, sem espaços nas pontas.
export const toPointLabels = ({
  max,
  min,
  pointLabels,
}: {
  min: number;
  max: number;
  pointLabels: readonly (string | undefined)[];
}) =>
  Array.from({ length: Math.max(max - min + 1, 0) }, (_, offset) =>
    (pointLabels[offset] ?? '').trim(),
  );

export const createEmptyOption = (): OptionInput => ({ optionId: '', label: '' });

const toScaleInput = (scale: QuestionScale | null) => {
  const { max, maxLabel, min, minLabel, pointLabels } = scale ?? DEFAULT_SCALE;

  return {
    min,
    max,
    minLabel: pointLabels ? '' : (minLabel ?? ''),
    maxLabel: pointLabels ? '' : (maxLabel ?? ''),
    namedPoints: pointLabels !== null,
    pointLabels: pointLabels ?? [],
  };
};

export const createEmptyQuestion = (): QuestionInput => ({
  questionId: '',
  title: '',
  description: '',
  fieldType: 'INPUT',
  required: false,
  options: [],
  scale: toScaleInput(null),
});

const addDays = (iso: string, days: number) => {
  const date = new Date(`${iso}T00:00:00Z`);

  date.setUTCDate(date.getUTCDate() + days);

  return date.toISOString().slice(0, 10);
};

export const toFormEditorInput = (form: Form | null): FormEditorInput => {
  if (!form) {
    const today = getTodayIsoDate();

    return {
      title: '',
      description: '',
      startsOn: today,
      endsOn: addDays(today, 30),
      status: 'DRAFT',
      questions: [createEmptyQuestion()],
      recipientGroupIds: [],
      anonymous: false,
      allowAnswerEdit: false,
      consentText: '',
    };
  }

  return {
    title: form.title,
    description: form.description ?? '',
    startsOn: form.startsOn,
    endsOn: form.endsOn,
    status: form.status,
    questions: form.questions.map(
      ({ description, fieldType, id, options, required, scale, title }) => ({
        questionId: id,
        title,
        description: description ?? '',
        fieldType,
        required,
        options: options.map(({ id: optionId, label }) => ({ optionId, label })),
        scale: toScaleInput(scale),
      }),
    ),
    recipientGroupIds: form.recipientGroupIds,
    anonymous: form.anonymous,
    allowAnswerEdit: form.allowAnswerEdit,
    consentText: form.consentText ?? '',
  };
};

// Tipos de texto não enviam opções, mesmo que existam no editor.
const toOptionDetails = (
  fieldType: FormEditorData['questions'][number]['fieldType'],
  options: FormEditorData['questions'][number]['options'],
) => {
  if (!isChoiceFieldType(fieldType)) {
    return [];
  }

  return options.map(({ label, optionId }) => ({
    id: optionId === '' ? null : optionId,
    label: label.trim().replace(/\s+/g, ' '),
  }));
};

// Só o tipo SCALE envia a escala; rótulos vazios viram null. Com nomes por ponto, as pontas repetem o
// primeiro e o último.
const toScaleDetails = (
  fieldType: FormEditorData['questions'][number]['fieldType'],
  scale: FormEditorData['questions'][number]['scale'],
): QuestionScale | null => {
  if (fieldType !== 'SCALE') {
    return null;
  }

  const { max, maxLabel, min, minLabel, namedPoints } = scale;

  if (namedPoints) {
    const pointLabels = toPointLabels(scale);

    return {
      min,
      max,
      minLabel: pointLabels.at(0) ?? null,
      maxLabel: pointLabels.at(-1) ?? null,
      pointLabels,
    };
  }

  return {
    min,
    max,
    minLabel: minLabel.trim() || null,
    maxLabel: maxLabel.trim() || null,
    pointLabels: null,
  };
};

export const toFormDetails = ({ questions, ...data }: FormEditorData): FormDetails => ({
  ...data,
  questions: questions.map(({ fieldType, options, questionId, scale, ...question }) => ({
    id: questionId === '' ? null : questionId,
    ...question,
    fieldType,
    options: toOptionDetails(fieldType, options),
    scale: toScaleDetails(fieldType, scale),
  })),
});

// Data civil ISO exibida no idioma atual, sem deslocamento de fuso.
export const formatCivilDate = (iso: string, locale: string) => {
  return new Intl.DateTimeFormat(locale, { timeZone: 'UTC', dateStyle: 'medium' }).format(
    new Date(`${iso}T00:00:00Z`),
  );
};

export const formatFileSize = (bytes: number, locale: string) => {
  const megabytes = bytes / (1024 * 1024);

  if (megabytes >= 1) {
    return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(megabytes)} MB`;
  }

  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(bytes / 1024)} KB`;
};
