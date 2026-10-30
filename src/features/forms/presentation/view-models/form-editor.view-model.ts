import type { TranslationKey } from '@/app/i18n/translation-key';
import { authSessionQueryOptions } from '@/features/auth/application/queries/auth-session.query';
import { LEADERSHIP_DEPARTMENT } from '@/features/departments/domain/department';
import {
  FORMS_QUERY_KEY,
  emailGroupsQueryOptions,
} from '@/features/forms/application/queries/forms.query';
import { inspectHeaderImageUseCase } from '@/features/forms/application/use-cases/inspect-header-image.use-case';
import {
  saveFormUseCase,
  type HeaderImageChange,
} from '@/features/forms/application/use-cases/save-form.use-case';
import {
  FormConflictError,
  INITIAL_FORM_STATUSES,
  HeaderImageSaveError,
  InvalidFormDataError,
  MAX_QUESTIONS,
  MIN_QUESTION_OPTIONS,
  formStatusTransitions,
  isChoiceFieldType,
  isFinalFormStatus,
  isSendingEmails,
  type Form,
  type HeaderImageIssue,
  type QuestionFieldType,
} from '@/features/forms/domain/form';
import {
  createEmptyOption,
  createEmptyQuestion,
  formEditorSchema,
  formatCivilDate,
  formatFileSize,
  formsValidationMessages,
  getFormsNotice,
  getServerDetail,
  toFormDetails,
  toFormEditorInput,
  toPointLabels,
  type FormEditorData,
  type FormEditorInput,
} from '@/features/forms/presentation/models/forms.model';
import { useGlobalLoading } from '@/shared/feedback/global-loading';
import { notify } from '@/shared/feedback/notify';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useState, type DragEvent } from 'react';
import { get, useFieldArray, useForm, useWatch, type FieldPath } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

// Campos do formulário que o servidor pode recusar (questions.N.* é tratado à parte).
const SERVER_FIELDS = [
  'title',
  'description',
  'startsOn',
  'endsOn',
  'status',
  'recipientGroupIds',
] as const;

const QUESTION_FIELD_PATTERN =
  /^questions\.\d+\.(?:title|description|fieldType|options(?:\.\d+\.label)?)$/;

// Nomes dos pontos na pré-visualização: o número ocupa o lugar do nome ainda vazio.
const previewPointLabels = (
  scale: Partial<FormEditorInput['questions'][number]['scale']> | undefined,
) => {
  if (!scale?.namedPoints) {
    return null;
  }

  const min = scale.min ?? 1;

  return toPointLabels({ min, max: scale.max ?? 5, pointLabels: scale.pointLabels ?? [] }).map(
    (label, offset) => label || String(min + offset),
  );
};

// Imagem escolhida e ainda não enviada: a prévia usa uma URL local do arquivo.
type PendingHeaderImage = {
  file: File;
  previewUrl: string;
  width: number;
  height: number;
};

type HeaderImageState =
  | { kind: 'keep' }
  | ({ kind: 'replace' } & PendingHeaderImage)
  | { kind: 'remove' };

type UseFormEditorViewModelOptions = {
  // Formulário em edição; null cria um novo.
  form: Form | null;
};

export const useFormEditorViewModel = ({ form }: UseFormEditorViewModelOptions) => {
  const { i18n, t } = useTranslation('forms');

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { data: session } = useQuery(authSessionQueryOptions);

  const {
    data: emailGroups = [],
    isError: hasEmailGroupsError,
    isPending: isLoadingEmailGroups,
    refetch: refetchEmailGroups,
  } = useQuery(emailGroupsQueryOptions());

  const isEditing = form !== null;

  // Enviando e-mails aos grupos: bloqueado até o fim do envio.
  const isSending = form !== null && isSendingEmails(form);

  // Finalizado, cancelado ou com envio em andamento: somente leitura.
  const isReadOnly = form !== null && (isFinalFormStatus(form.status) || isSending);

  const statusOptions = form ? formStatusTransitions[form.status] : INITIAL_FORM_STATUSES;

  const editorForm = useForm<FormEditorInput, unknown, FormEditorData>({
    resolver: zodResolver(formEditorSchema),
    defaultValues: toFormEditorInput(form),
    mode: 'onTouched',
  });

  const {
    control,
    formState: { errors, isSubmitted, touchedFields },
    getValues,
    handleSubmit,
    setError,
    setValue,
  } = editorForm;

  const {
    append,
    fields: questionFields,
    insert,
    move,
    remove,
  } = useFieldArray({ control, name: 'questions', keyName: 'key' });

  const values = useWatch({ control });

  const [headerImage, setHeaderImage] = useState<HeaderImageState>({ kind: 'keep' });

  const [headerImageIssue, setHeaderImageIssue] = useState<HeaderImageIssue | null>(null);

  const [isInspectingImage, setIsInspectingImage] = useState(false);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Libera a URL local da imagem escolhida quando ela é trocada, removida ou a tela sai.
  const pendingPreviewUrl = headerImage.kind === 'replace' ? headerImage.previewUrl : null;

  useEffect(() => {
    if (!pendingPreviewUrl) {
      return undefined;
    }

    return () => {
      URL.revokeObjectURL(pendingPreviewUrl);
    };
  }, [pendingPreviewUrl]);

  const { isPending, mutate } = useMutation({
    mutationFn: ({
      csrfToken,
      data,
      imageChange,
    }: {
      csrfToken: string;
      data: FormEditorData;
      imageChange: HeaderImageChange;
    }) =>
      saveFormUseCase({
        csrfToken,
        department: LEADERSHIP_DEPARTMENT,
        form,
        details: toFormDetails(data),
        headerImage: imageChange,
      }),
    onSuccess: async ({ title }) => {
      await queryClient.invalidateQueries({ queryKey: FORMS_QUERY_KEY });

      notify.success({
        title: isEditing ? t('editor.success.editTitle') : t('editor.success.createTitle'),
        description: t('editor.success.description', { title }),
      });

      await navigate({ to: '/departamentos/lideranca/formularios' });
    },
    onError: async (saveError) => {
      // Dados salvos, imagem não: avisa e abre o formulário gravado para tentar a imagem de novo
      // (salvar outra vez a partir de "novo" duplicaria o formulário).
      if (saveError instanceof HeaderImageSaveError) {
        await queryClient.invalidateQueries({ queryKey: FORMS_QUERY_KEY });

        notify.error({
          title: t('editor.imageFailure.title'),
          description: t('editor.imageFailure.description', { title: saveError.form.title }),
        });

        await navigate({
          to: '/departamentos/lideranca/formularios/$formId',
          params: { formId: saveError.form.id },
        });

        return;
      }

      // Campos recusados pelo servidor ficam marcados no próprio formulário.
      if (saveError instanceof InvalidFormDataError) {
        saveError.fields.forEach((field) => {
          if (QUESTION_FIELD_PATTERN.test(field)) {
            setError(field as FieldPath<FormEditorInput>, {
              type: 'server',
              message: formsValidationMessages.invalid,
            });

            return;
          }

          if ((SERVER_FIELDS as readonly string[]).includes(field)) {
            setError(field as (typeof SERVER_FIELDS)[number], {
              type: 'server',
              message: formsValidationMessages.invalid,
            });
          }
        });
      }

      const notice = getFormsNotice(saveError);

      notify.error({
        title: t(`notices.${notice}.title`),
        description: getServerDetail(saveError) ?? t(`notices.${notice}.description`),
      });

      // Na edição, um conflito indica dados desatualizados: recarrega o formulário.
      if (saveError instanceof FormConflictError && isEditing) {
        await queryClient.invalidateQueries({ queryKey: FORMS_QUERY_KEY });
      }
    },
  });

  useGlobalLoading(isPending);

  // O erro aparece depois do envio ou ao sair de um campo preenchido.
  const getFieldError = (name: FieldPath<FormEditorInput>) => {
    const message: string | undefined = get(errors, name)?.message;

    const isVisible =
      isSubmitted || (Boolean(get(touchedFields, name)) && Boolean(getValues(name)));

    return message && isVisible ? t(message as TranslationKey<'forms'>) : undefined;
  };

  // Erros de lista (perguntas, opções e destinatários) só aparecem depois do envio.
  const getListError = (
    name: 'questions' | 'recipientGroupIds' | `questions.${number}.options`,
  ) => {
    const error = get(errors, name);

    const message: string | undefined = error?.root?.message ?? error?.message;

    return message && isSubmitted ? t(message as TranslationKey<'forms'>) : undefined;
  };

  const selectHeaderImage = async (file: File) => {
    setIsInspectingImage(true);

    try {
      const inspection = await inspectHeaderImageUseCase(file);

      if (!inspection.accepted) {
        setHeaderImageIssue(inspection.issue);

        return;
      }

      setHeaderImageIssue(null);

      setHeaderImage({
        kind: 'replace',
        file,
        previewUrl: URL.createObjectURL(file),
        width: inspection.width,
        height: inspection.height,
      });
    } finally {
      setIsInspectingImage(false);
    }
  };

  const removeHeaderImage = () => {
    setHeaderImageIssue(null);

    setHeaderImage(form?.headerImage ? { kind: 'remove' } : { kind: 'keep' });
  };

  // Imagem exibida agora: a escolhida, a já salva (se não foi removida) ou nenhuma.
  const getHeaderImagePreview = () => {
    if (headerImage.kind === 'replace') {
      const { file, height, previewUrl, width } = headerImage;

      return {
        url: previewUrl,
        width,
        height,
        details: t('headerImage.details', {
          name: file.name,
          width,
          height,
          size: formatFileSize(file.size, i18n.language),
        }),
      };
    }

    const savedImage = headerImage.kind === 'keep' ? form?.headerImage : null;

    if (!savedImage) {
      return null;
    }

    const { byteSize, height, url, width } = savedImage;

    return {
      url,
      width,
      height,
      details: t('headerImage.savedDetails', {
        width,
        height,
        size: formatFileSize(byteSize, i18n.language),
      }),
    };
  };

  const headerImagePreview = getHeaderImagePreview();

  const addQuestion = () => {
    if (questionFields.length < MAX_QUESTIONS) {
      append(createEmptyQuestion(), { shouldFocus: true });
    }
  };

  const moveQuestion = (from: number, to: number) => {
    if (to >= 0 && to < questionFields.length) {
      move(from, to);
    }
  };

  const removeQuestion = (index: number) => {
    remove(index);
  };

  // Ligar o anonimato desliga a edição da resposta (resposta anônima não é localizável depois).
  const anonymousField = editorForm.register('anonymous', {
    onChange: ({ target }: { target: HTMLInputElement }) => {
      if (target.checked) {
        setValue('allowAnswerEdit', false, { shouldDirty: true });
      }
    },
  });

  // Cópia logo abaixo da original, como pergunta nova (sem os IDs salvos).
  const duplicateQuestion = (index: number) => {
    const question = getValues(`questions.${index}`);

    if (questionFields.length >= MAX_QUESTIONS) {
      return;
    }

    insert(
      index + 1,
      {
        ...question,
        questionId: '',
        options: question.options.map(({ label }) => ({ optionId: '', label })),
      },
      { shouldFocus: true },
    );
  };

  // Arrastar e soltar: o cartão só fica arrastável enquanto a alça é segurada (os campos de texto
  // continuam selecionáveis); ao passar sobre outra pergunta, ela troca de lugar.
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const [draggableIndex, setDraggableIndex] = useState<number | null>(null);

  const dragHandlers = (index: number) => ({
    onDragStart: () => setDragIndex(index),
    onDragOver: (event: DragEvent<HTMLElement>) => {
      if (dragIndex === null) {
        return;
      }

      event.preventDefault();

      if (dragIndex !== index) {
        move(dragIndex, index);

        setDragIndex(index);
      }
    },
    onDragEnd: () => {
      setDragIndex(null);

      setDraggableIndex(null);
    },
  });

  // Ao virar checkbox ou radio sem opções, a pergunta já ganha a opção mínima em branco.
  const changeFieldType = (index: number, fieldType: QuestionFieldType) => {
    setValue(`questions.${index}.fieldType`, fieldType, { shouldDirty: true });

    const options = getValues(`questions.${index}.options`);

    if (isChoiceFieldType(fieldType) && options.length === 0) {
      setValue(
        `questions.${index}.options`,
        Array.from({ length: MIN_QUESTION_OPTIONS }, createEmptyOption),
        { shouldDirty: true },
      );
    }
  };

  const toImageChange = (): HeaderImageChange => {
    if (headerImage.kind === 'replace') {
      return { kind: 'replace', file: headerImage.file };
    }

    return headerImage;
  };

  const submit = handleSubmit(
    (data) => {
      if (isPending || isReadOnly || !session) {
        return;
      }

      mutate({ csrfToken: session.csrfToken, data, imageChange: toImageChange() });
    },
    () => {
      notify.error({
        title: t('editor.invalid.title'),
        description: t('editor.invalid.description'),
      });
    },
  );

  const startsOn = values.startsOn ?? '';

  const endsOn = values.endsOn ?? '';

  const getPeriod = () => {
    if (!startsOn || !endsOn) {
      return '';
    }

    return t('list.period', {
      start: formatCivilDate(startsOn, i18n.language),
      end: formatCivilDate(endsOn, i18n.language),
    });
  };

  const preview = {
    title: values.title?.trim() || t('preview.untitled'),
    description: values.description?.trim() ?? '',
    period: getPeriod(),
    questions: (values.questions ?? []).map((question, index) => ({
      key: questionFields[index]?.key ?? String(index),
      title: question?.title?.trim() || t('preview.untitledQuestion', { number: index + 1 }),
      description: question?.description?.trim() ?? '',
      fieldType: question?.fieldType ?? 'INPUT',
      required: question?.required ?? false,
      scale: {
        min: question?.scale?.min ?? 1,
        max: question?.scale?.max ?? 5,
        minLabel: question?.scale?.minLabel?.trim() || null,
        maxLabel: question?.scale?.maxLabel?.trim() || null,
        pointLabels: previewPointLabels(question?.scale),
      },
      options: (question?.options ?? []).map((option, optionIndex) => ({
        id: String(optionIndex),
        label: option?.label?.trim() || t('preview.untitledOption', { number: optionIndex + 1 }),
      })),
    })),
    consentText: values.consentText?.trim() || null,
  };

  return {
    addQuestion,
    canAddQuestion: questionFields.length < MAX_QUESTIONS,
    anonymousField,
    dragHandlers,
    dragIndex,
    draggableIndex,
    duplicateQuestion,
    setDraggableIndex,
    changeFieldType,
    editorForm,
    emailGroups,
    getFieldError,
    getListError,
    hasEmailGroupsError,
    headerImageIssue,
    headerImagePreview,
    isEditing,
    isInspectingImage,
    isLoadingEmailGroups,
    isPreviewOpen,
    isReadOnly,
    isSendingEmails: isSending,
    isSubmitting: isPending,
    moveQuestion,
    preview,
    questionFields,
    // Tipo atual de cada pergunta (define se a lista de opções aparece).
    questionTypes: (values.questions ?? []).map((question) => question?.fieldType ?? 'INPUT'),
    // Anônimo não permite editar a resposta depois.
    isAnonymous: values.anonymous ?? false,
    refetchEmailGroups: () => void refetchEmailGroups(),
    removeHeaderImage,
    removeQuestion,
    selectHeaderImage,
    setIsPreviewOpen,
    statusOptions,
    submit,
  };
};
