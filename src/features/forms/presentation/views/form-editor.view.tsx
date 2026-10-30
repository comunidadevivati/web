import { CardSectionHeader, FormField, TooltipHint } from '@/components/molecules';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Box,
  Button,
  buttonVariants,
  Card,
  CardContent,
  Checkbox,
  FieldGroup,
  FieldLegend,
  FieldSet,
  Form,
  Heading,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Spinner,
  Text,
  Textarea,
} from '@/components/ui';
import {
  CONSENT_TEXT_MAX_LENGTH,
  FORM_DESCRIPTION_MAX_LENGTH,
  FORM_TITLE_MAX_LENGTH,
  QUESTION_DESCRIPTION_MAX_LENGTH,
  QUESTION_FIELD_TYPES,
  QUESTION_TITLE_MAX_LENGTH,
  isChoiceFieldType,
  type Form as FormRecord,
  type FormStatus,
  type QuestionFieldType,
} from '@/features/forms/domain/form';
import { FormPreviewDialog } from '@/features/forms/presentation/components/form-preview-dialog';
import { HeaderImageField } from '@/features/forms/presentation/components/header-image-field';
import { QuestionOptionsField } from '@/features/forms/presentation/components/question-options-field';
import { QuestionScaleField } from '@/features/forms/presentation/components/question-scale-field';
import { useFormEditorViewModel } from '@/features/forms/presentation/view-models/form-editor.view-model';
import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';
import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowUpIcon,
  CircleAlertIcon,
  CopyIcon,
  EyeIcon,
  FileTextIcon,
  GripVerticalIcon,
  ListChecksIcon,
  LockIcon,
  MailIcon,
  PlusIcon,
  RefreshCwIcon,
  SaveIcon,
  SettingsIcon,
  Trash2Icon,
} from 'lucide-react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

type FormEditorViewProps = {
  // Formulário em edição; null cria um novo.
  form: FormRecord | null;
};

const describedBy = (id: string, error?: string) => {
  return error ? `${id}-error` : undefined;
};

// Criação e edição do formulário: dados gerais, imagem do cabeçalho, perguntas, status e grupos de
// e-mail destinatários. Finalizado ou cancelado abre somente para leitura.
export const FormEditorView = ({ form }: FormEditorViewProps) => {
  const {
    addQuestion,
    canAddQuestion,
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
    isSendingEmails,
    isSubmitting,
    moveQuestion,
    dragHandlers,
    dragIndex,
    draggableIndex,
    duplicateQuestion,
    anonymousField,
    isAnonymous,
    setDraggableIndex,
    preview,
    questionFields,
    questionTypes,
    refetchEmailGroups,
    removeHeaderImage,
    removeQuestion,
    selectHeaderImage,
    setIsPreviewOpen,
    statusOptions,
    submit,
  } = useFormEditorViewModel({ form });

  const { control, register, setValue } = editorForm;

  const { t } = useTranslation('forms');

  const isLocked = isReadOnly || isSubmitting;

  const titleError = getFieldError('title');

  const descriptionError = getFieldError('description');

  const startsOnError = getFieldError('startsOn');

  const endsOnError = getFieldError('endsOn');

  const questionsError = getListError('questions');

  const recipientsError = getListError('recipientGroupIds');

  const statusItems = statusOptions.map((value) => ({ value, label: t(`status.${value}`) }));

  const fieldTypeItems = QUESTION_FIELD_TYPES.map((value) => ({
    value,
    label: t(`fieldTypes.${value}`),
  }));

  return (
    <Box className="grid gap-6">
      <Link
        className="
          inline-flex w-fit items-center gap-1.5 text-sm font-medium text-primary-strong
          hover:underline
        "
        to="/departamentos/lideranca/formularios"
      >
        <ArrowLeftIcon aria-hidden="true" className="size-4" />
        {t('editor.back')}
      </Link>

      <Box className="flex flex-wrap items-end justify-between gap-4">
        <Box className="min-w-0">
          <Heading className="text-2xl font-semibold tracking-tight text-foreground">
            {isEditing ? t('editor.editTitle') : t('editor.createTitle')}
          </Heading>

          <Text className="mt-1 text-muted-foreground">
            {isEditing ? (form?.title ?? '') : t('editor.createSubtitle')}
          </Text>
        </Box>

        <Button
          className="h-11 w-full sm:w-auto sm:px-5"
          type="button"
          variant="outline"
          onClick={() => setIsPreviewOpen(true)}
        >
          <EyeIcon data-icon="inline-start" />
          {t('editor.preview')}
        </Button>
      </Box>

      {isReadOnly && form && (
        <Alert>
          <LockIcon />

          <AlertTitle>
            {isSendingEmails ? t('emailDispatch.sending') : t('editor.readOnly.title')}
          </AlertTitle>

          <AlertDescription>
            {isSendingEmails
              ? t('emailDispatch.editorLocked')
              : t('editor.readOnly.description', { status: t(`status.${form.status}`) })}
          </AlertDescription>
        </Alert>
      )}

      <Form className="grid gap-6" noValidate onSubmit={submit}>
        <Card className="border-border surface-card shadow-sm">
          <CardSectionHeader
            description={t('editor.sections.general.description')}
            icon={FileTextIcon}
            title={t('editor.sections.general.title')}
          />

          <CardContent className="grid gap-5">
            <HeaderImageField
              disabled={isLocked}
              error={headerImageIssue ? t(`headerImage.issues.${headerImageIssue}`) : undefined}
              isInspecting={isInspectingImage}
              preview={headerImagePreview}
              onRemove={removeHeaderImage}
              onSelect={(file) => void selectHeaderImage(file)}
            />

            <FieldGroup className="gap-4">
              <FormField error={titleError} id="form-title" label={t('fields.title')}>
                <Input
                  id="form-title"
                  aria-describedby={describedBy('form-title', titleError)}
                  aria-invalid={Boolean(titleError)}
                  aria-required
                  autoComplete="off"
                  disabled={isLocked}
                  maxLength={FORM_TITLE_MAX_LENGTH}
                  placeholder={t('fields.titlePlaceholder')}
                  type="text"
                  {...register('title')}
                />
              </FormField>

              <FormField
                error={descriptionError}
                id="form-description"
                label={t('fields.description')}
              >
                <Textarea
                  id="form-description"
                  aria-describedby={describedBy('form-description', descriptionError)}
                  aria-invalid={Boolean(descriptionError)}
                  disabled={isLocked}
                  maxLength={FORM_DESCRIPTION_MAX_LENGTH}
                  placeholder={t('fields.descriptionPlaceholder')}
                  rows={4}
                  {...register('description')}
                />
              </FormField>

              <Box className="grid gap-4 sm:grid-cols-2">
                <FormField error={startsOnError} id="form-starts-on" label={t('fields.startsOn')}>
                  <Input
                    id="form-starts-on"
                    aria-describedby={describedBy('form-starts-on', startsOnError)}
                    aria-invalid={Boolean(startsOnError)}
                    aria-required
                    disabled={isLocked}
                    type="date"
                    {...register('startsOn', { deps: ['endsOn'] })}
                  />
                </FormField>

                <FormField error={endsOnError} id="form-ends-on" label={t('fields.endsOn')}>
                  <Input
                    id="form-ends-on"
                    aria-describedby={describedBy('form-ends-on', endsOnError)}
                    aria-invalid={Boolean(endsOnError)}
                    aria-required
                    disabled={isLocked}
                    type="date"
                    {...register('endsOn')}
                  />
                </FormField>
              </Box>

              <FormField
                description={t('fields.statusHint')}
                id="form-status"
                label={t('fields.status')}
              >
                <Controller
                  control={control}
                  name="status"
                  render={({ field: { onBlur, onChange, value } }) => (
                    <Select
                      disabled={isLocked}
                      items={statusItems}
                      value={value}
                      onValueChange={(next) => onChange((next as FormStatus | null) ?? value)}
                    >
                      <SelectTrigger
                        id="form-status"
                        aria-describedby="form-status-description"
                        className="sm:max-w-xs"
                        onBlur={onBlur}
                      >
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        {statusItems.map(({ label, value: option }) => (
                          <SelectItem key={option} value={option}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>
            </FieldGroup>
          </CardContent>
        </Card>

        <Card className="border-border surface-card shadow-sm">
          <CardSectionHeader
            description={t('editor.sections.questions.description')}
            icon={ListChecksIcon}
            title={t('editor.sections.questions.title')}
          />

          <CardContent className="grid gap-4">
            {questionFields.map(({ key }, index) => {
              const prefix = `form-question-${index}`;

              const questionTitleError = getFieldError(`questions.${index}.title`);

              const questionDescriptionError = getFieldError(`questions.${index}.description`);

              const isFirst = index === 0;

              const isLast = index === questionFields.length - 1;

              const fieldType = questionTypes[index] ?? 'INPUT';

              return (
                <Box
                  key={key}
                  aria-label={t('questions.groupLabel', { number: index + 1 })}
                  className={cn(
                    'grid gap-4 rounded-xl border border-border bg-muted/30 p-4 transition-opacity',
                    dragIndex === index && 'border-primary/50 opacity-60',
                  )}
                  draggable={!isLocked && draggableIndex === index}
                  role="group"
                  {...dragHandlers(index)}
                >
                  <Box className="flex items-center justify-between gap-2">
                    <Box className="flex items-center gap-1">
                      {!isLocked && (
                        <TooltipHint label={t('questions.drag')}>
                          <Box
                            aria-hidden="true"
                            className="
                              flex size-8 cursor-grab items-center justify-center rounded-md
                              text-muted-foreground hover:bg-primary/10 active:cursor-grabbing
                            "
                            onPointerDown={() => setDraggableIndex(index)}
                            onPointerUp={() => setDraggableIndex(null)}
                          >
                            <GripVerticalIcon className="size-4" />
                          </Box>
                        </TooltipHint>
                      )}

                      <Text className="text-sm font-semibold text-primary-strong">
                        {t('questions.number', { number: index + 1 })}
                      </Text>
                    </Box>

                    <Box className="flex gap-1">
                      <Button
                        aria-label={t('questions.duplicate', { number: index + 1 })}
                        className="size-10"
                        disabled={isLocked || !canAddQuestion}
                        size="icon"
                        type="button"
                        variant="ghost"
                        onClick={() => duplicateQuestion(index)}
                      >
                        <CopyIcon />
                      </Button>

                      <Button
                        aria-label={t('questions.moveUp', { number: index + 1 })}
                        className="size-10"
                        disabled={isLocked || isFirst}
                        size="icon"
                        type="button"
                        variant="ghost"
                        onClick={() => moveQuestion(index, index - 1)}
                      >
                        <ArrowUpIcon />
                      </Button>

                      <Button
                        aria-label={t('questions.moveDown', { number: index + 1 })}
                        className="size-10"
                        disabled={isLocked || isLast}
                        size="icon"
                        type="button"
                        variant="ghost"
                        onClick={() => moveQuestion(index, index + 1)}
                      >
                        <ArrowDownIcon />
                      </Button>

                      <Button
                        aria-label={t('questions.remove', { number: index + 1 })}
                        className="size-10"
                        disabled={isLocked || questionFields.length === 1}
                        size="icon"
                        type="button"
                        variant="destructive"
                        onClick={() => removeQuestion(index)}
                      >
                        <Trash2Icon />
                      </Button>
                    </Box>
                  </Box>

                  <Box className="grid gap-4 md:grid-cols-[minmax(0,1fr)_14rem]">
                    <FormField
                      error={questionTitleError}
                      id={`${prefix}-title`}
                      label={t('questions.title')}
                    >
                      <Input
                        id={`${prefix}-title`}
                        aria-describedby={describedBy(`${prefix}-title`, questionTitleError)}
                        aria-invalid={Boolean(questionTitleError)}
                        aria-required
                        autoComplete="off"
                        disabled={isLocked}
                        maxLength={QUESTION_TITLE_MAX_LENGTH}
                        placeholder={t('questions.titlePlaceholder')}
                        type="text"
                        {...register(`questions.${index}.title`)}
                      />
                    </FormField>

                    <FormField id={`${prefix}-type`} label={t('questions.fieldType')}>
                      <Controller
                        control={control}
                        name={`questions.${index}.fieldType`}
                        render={({ field: { onBlur, value } }) => (
                          <Select
                            disabled={isLocked}
                            items={fieldTypeItems}
                            value={value}
                            onValueChange={(next) =>
                              changeFieldType(index, (next as QuestionFieldType | null) ?? value)
                            }
                          >
                            <SelectTrigger id={`${prefix}-type`} onBlur={onBlur}>
                              <SelectValue />
                            </SelectTrigger>

                            <SelectContent>
                              {fieldTypeItems.map(({ label, value: option }) => (
                                <SelectItem key={option} value={option}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </FormField>
                  </Box>

                  <FormField
                    error={questionDescriptionError}
                    id={`${prefix}-description`}
                    label={t('questions.description')}
                  >
                    <Textarea
                      id={`${prefix}-description`}
                      aria-describedby={describedBy(
                        `${prefix}-description`,
                        questionDescriptionError,
                      )}
                      aria-invalid={Boolean(questionDescriptionError)}
                      className="min-h-16"
                      disabled={isLocked}
                      maxLength={QUESTION_DESCRIPTION_MAX_LENGTH}
                      placeholder={t('questions.descriptionPlaceholder')}
                      rows={2}
                      {...register(`questions.${index}.description`)}
                    />
                  </FormField>

                  <Label
                    className="flex w-fit cursor-pointer items-center gap-2 font-normal"
                    htmlFor={`${prefix}-required`}
                  >
                    <Checkbox
                      disabled={isLocked}
                      id={`${prefix}-required`}
                      {...register(`questions.${index}.required`)}
                    />
                    {t('questions.required')}
                  </Label>

                  {fieldType === 'SCALE' && (
                    <QuestionScaleField
                      control={control}
                      disabled={isLocked}
                      getError={(field) => getFieldError(`questions.${index}.scale.${field}`)}
                      questionIndex={index}
                      register={register}
                      setValue={setValue}
                    />
                  )}

                  {isChoiceFieldType(fieldType) && (
                    <QuestionOptionsField
                      control={control}
                      disabled={isLocked}
                      fieldType={fieldType}
                      getOptionError={(optionIndex) =>
                        getFieldError(`questions.${index}.options.${optionIndex}.label`)
                      }
                      listError={getListError(`questions.${index}.options`)}
                      questionIndex={index}
                      register={register}
                    />
                  )}
                </Box>
              );
            })}

            {questionsError && (
              <Text className="text-sm text-destructive-strong" role="alert">
                {questionsError}
              </Text>
            )}

            <Button
              className="h-11 w-full sm:w-fit sm:px-5"
              disabled={isLocked || !canAddQuestion}
              type="button"
              variant="outline"
              onClick={addQuestion}
            >
              <PlusIcon data-icon="inline-start" />
              {t('questions.add')}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border surface-card shadow-sm">
          <CardSectionHeader
            description={t('editor.sections.settings.description')}
            icon={SettingsIcon}
            title={t('editor.sections.settings.title')}
          />

          <CardContent className="grid gap-4">
            <Label
              className="flex cursor-pointer items-start gap-3 font-normal"
              htmlFor="form-anonymous"
            >
              <Checkbox
                className="mt-0.5"
                disabled={isLocked}
                id="form-anonymous"
                {...anonymousField}
              />

              <Box className="grid gap-0.5">
                <Text className="text-sm font-semibold text-foreground">
                  {t('settings.anonymous')}
                </Text>

                <Text className="text-xs text-muted-foreground">{t('settings.anonymousHint')}</Text>
              </Box>
            </Label>

            <Label
              className={cn(
                'flex cursor-pointer items-start gap-3 font-normal',
                isAnonymous && 'cursor-not-allowed opacity-60',
              )}
              htmlFor="form-allow-answer-edit"
            >
              <Checkbox
                className="mt-0.5"
                disabled={isLocked || isAnonymous}
                id="form-allow-answer-edit"
                {...register('allowAnswerEdit')}
              />

              <Box className="grid gap-0.5">
                <Text className="text-sm font-semibold text-foreground">
                  {t('settings.allowAnswerEdit')}
                </Text>

                <Text className="text-xs text-muted-foreground">
                  {isAnonymous
                    ? t('settings.allowAnswerEditAnonymous')
                    : t('settings.allowAnswerEditHint')}
                </Text>
              </Box>
            </Label>

            <FormField
              description={t('settings.consentHint')}
              error={getFieldError('consentText')}
              id="form-consent"
              label={t('settings.consent')}
            >
              <Textarea
                id="form-consent"
                aria-invalid={Boolean(getFieldError('consentText'))}
                disabled={isLocked}
                maxLength={CONSENT_TEXT_MAX_LENGTH}
                placeholder={t('settings.consentPlaceholder')}
                rows={3}
                {...register('consentText')}
              />
            </FormField>
          </CardContent>
        </Card>

        <Card className="border-border surface-card shadow-sm">
          <CardSectionHeader
            description={t('editor.sections.recipients.description')}
            icon={MailIcon}
            title={t('editor.sections.recipients.title')}
          />

          <CardContent className="grid gap-4">
            {isLoadingEmailGroups && (
              <Box className="flex justify-center py-6">
                <Spinner className="size-6 text-primary-strong" />
              </Box>
            )}

            {hasEmailGroupsError && (
              <Alert variant="destructive">
                <CircleAlertIcon />

                <AlertTitle>{t('recipients.unavailable.title')}</AlertTitle>

                <AlertDescription className="grid gap-3">
                  {t('recipients.unavailable.description')}

                  <Button
                    className="w-fit"
                    size="sm"
                    type="button"
                    variant="outline"
                    onClick={refetchEmailGroups}
                  >
                    <RefreshCwIcon data-icon="inline-start" />
                    {t('actions.retry')}
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {!isLoadingEmailGroups && !hasEmailGroupsError && (
              <Controller
                control={control}
                name="recipientGroupIds"
                render={({ field: { onChange, value } }) => (
                  <FieldSet
                    aria-describedby={recipientsError ? 'form-recipients-error' : undefined}
                    aria-invalid={Boolean(recipientsError)}
                    className="gap-3"
                  >
                    <FieldLegend className="sr-only">{t('recipients.legend')}</FieldLegend>

                    <Box className="grid gap-2 sm:grid-cols-2">
                      {emailGroups.map(({ description, id, name, recipientCount }) => {
                        const isChecked = value.includes(id);

                        return (
                          <Label
                            key={id}
                            className={cn(
                              `
                                flex min-h-11 cursor-pointer items-start gap-3 rounded-lg border
                                border-border p-3 font-normal transition-colors
                                hover:border-primary/40
                              `,
                              isChecked && 'border-primary/50 bg-primary/10',
                              isLocked && 'cursor-not-allowed opacity-70',
                            )}
                            htmlFor={`form-recipient-${id}`}
                          >
                            <Checkbox
                              checked={isChecked}
                              className="mt-0.5"
                              disabled={isLocked}
                              id={`form-recipient-${id}`}
                              onChange={({ target: { checked } }) =>
                                onChange(
                                  checked
                                    ? [...value, id]
                                    : value.filter((groupId) => groupId !== id),
                                )
                              }
                            />

                            <Box className="grid min-w-0 gap-1">
                              <Text className="text-sm font-semibold text-foreground">{name}</Text>

                              <Text className="text-xs text-muted-foreground">
                                {t('recipients.count', { count: recipientCount })}
                                {description ? ` · ${description}` : ''}
                              </Text>
                            </Box>
                          </Label>
                        );
                      })}
                    </Box>

                    {recipientsError && (
                      <Text
                        className="text-sm text-destructive-strong"
                        id="form-recipients-error"
                        role="alert"
                      >
                        {recipientsError}
                      </Text>
                    )}
                  </FieldSet>
                )}
              />
            )}
          </CardContent>
        </Card>

        <Box className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            className={cn(buttonVariants({ variant: 'outline' }), 'h-11 sm:px-5')}
            to="/departamentos/lideranca/formularios"
          >
            {isReadOnly ? t('editor.backToList') : t('editor.cancel')}
          </Link>

          {!isReadOnly && (
            <Button
              aria-busy={isSubmitting}
              className="h-11 sm:px-5"
              disabled={isSubmitting || isInspectingImage}
              type="submit"
            >
              {isSubmitting ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <SaveIcon data-icon="inline-start" />
              )}
              {isSubmitting ? t('editor.submitting') : t('editor.submit')}
            </Button>
          )}
        </Box>
      </Form>

      <FormPreviewDialog
        description={preview.description}
        headerImage={headerImagePreview}
        open={isPreviewOpen}
        period={preview.period}
        consentText={preview.consentText}
        questions={preview.questions}
        title={preview.title}
        onOpenChange={setIsPreviewOpen}
      />
    </Box>
  );
};
