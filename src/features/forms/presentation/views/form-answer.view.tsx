import { PreferencesControls } from '@/components/organisms';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Box,
  Button,
  Checkbox,
  Form,
  Heading,
  Image,
  Input,
  Label,
  Spinner,
  Text,
} from '@/components/ui';
import { QuestionAnswerField } from '@/features/forms/presentation/components/question-answer-field';
import { useFormAnswerViewModel } from '@/features/forms/presentation/view-models/form-answer.view-model';
import { cn } from '@/lib/utils';
import {
  CalendarRangeIcon,
  CircleAlertIcon,
  CircleCheckIcon,
  LockIcon,
  RefreshCwIcon,
  SendIcon,
  ShieldCheckIcon,
} from 'lucide-react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

// Página pública de resposta, aberta pelo link pessoal do e-mail: nome e e-mail vêm do convite (não
// editáveis), e cada link aceita uma única resposta enquanto o formulário estiver aberto.
export const FormAnswerView = () => {
  const {
    answerForm,
    answeredAt,
    canAnswer,
    emptyError,
    errorNotice,
    getAnswerError,
    consentError,
    draftRestored,
    isEditing,
    invitation,
    isLinkMissing,
    isLoading,
    isRetrying,
    isSubmitting,
    period,
    retry,
    submit,
  } = useFormAnswerViewModel();

  const { control, register } = answerForm;

  const { t } = useTranslation('forms');

  const isLocked = !canAnswer || isSubmitting;

  const renderBody = () => {
    if (isLinkMissing || errorNotice === 'invalidLink') {
      return (
        <Alert variant="destructive">
          <CircleAlertIcon />

          <AlertTitle>{t('answer.notices.invalidLink.title')}</AlertTitle>

          <AlertDescription>{t('answer.notices.invalidLink.description')}</AlertDescription>
        </Alert>
      );
    }

    if (isLoading) {
      return (
        <Box className="flex min-h-64 items-center justify-center">
          <Spinner className="size-8 text-primary-strong" />
        </Box>
      );
    }

    if (!invitation) {
      return (
        <Alert variant="destructive">
          <CircleAlertIcon />

          <AlertTitle>{t('answer.notices.unavailable.title')}</AlertTitle>

          <AlertDescription className="grid gap-3">
            {t('answer.notices.unavailable.description')}

            <Button
              className="w-fit"
              disabled={isRetrying}
              size="sm"
              type="button"
              variant="outline"
              onClick={retry}
            >
              <RefreshCwIcon
                className={cn(isRetrying && 'animate-spin')}
                data-icon="inline-start"
              />
              {t('actions.retry')}
            </Button>
          </AlertDescription>
        </Alert>
      );
    }

    const { form, recipient, status, availability } = invitation;

    // Papel, anônimo (respostas não voltam), editável até o fim do período ou respondido.
    const getAnsweredMessage = () => {
      if (invitation.answerChannel === 'PAPER') {
        return 'paperDescription';
      }

      if (form.anonymous) {
        return 'anonymousDescription';
      }

      return isEditing ? 'editableDescription' : 'description';
    };

    const answeredMessage = getAnsweredMessage();

    return (
      <Form className="grid gap-6" noValidate onSubmit={submit}>
        {form.headerImage && (
          <Image
            alt=""
            aria-hidden="true"
            className="mx-auto block h-auto max-h-150 w-auto max-w-full rounded-lg"
            height={form.headerImage.height}
            src={form.headerImage.url}
            width={form.headerImage.width}
          />
        )}

        <Box className="grid gap-2">
          <Heading className="text-2xl font-semibold tracking-tight text-foreground">
            {form.title}
          </Heading>

          <Box className="flex items-center gap-1.5">
            <CalendarRangeIcon aria-hidden="true" className="size-4 text-primary-strong" />

            <Text className="text-sm">{period}</Text>
          </Box>

          {form.description && (
            <Text className="leading-relaxed whitespace-pre-line text-muted-foreground">
              {form.description}
            </Text>
          )}
        </Box>

        {status === 'ANSWERED' && (
          <Alert>
            <CircleCheckIcon />

            <AlertTitle>{t('answer.answered.title')}</AlertTitle>

            <AlertDescription>
              {t(`answer.answered.${answeredMessage}`, { date: answeredAt ?? '' })}
            </AlertDescription>
          </Alert>
        )}

        {status === 'PENDING' && availability !== 'OPEN' && (
          <Alert>
            <LockIcon />

            <AlertTitle>{t(`answer.availability.${availability}.title`)}</AlertTitle>

            <AlertDescription>
              {t(`answer.availability.${availability}.description`, { period })}
            </AlertDescription>
          </Alert>
        )}

        <Box className="grid gap-4 sm:grid-cols-2">
          <Box className="grid gap-2">
            <Label htmlFor="answer-name">{t('answer.fields.name')}</Label>

            <Input disabled id="answer-name" readOnly type="text" value={recipient.name} />
          </Box>

          <Box className="grid gap-2">
            <Label htmlFor="answer-email">{t('answer.fields.email')}</Label>

            <Input disabled id="answer-email" readOnly type="email" value={recipient.email} />
          </Box>
        </Box>

        {form.anonymous && (
          <Alert>
            <ShieldCheckIcon />

            <AlertTitle>{t('answer.anonymous.title')}</AlertTitle>

            <AlertDescription>{t('answer.anonymous.description')}</AlertDescription>
          </Alert>
        )}

        {form.questions.some(({ required }) => required) && (
          <Text className="text-xs text-muted-foreground">{t('answer.requiredLegend')}</Text>
        )}

        <Box className="grid gap-5">
          {form.questions.map((question, index) => (
            <Controller
              key={question.id}
              control={control}
              name={`answers.${question.id}`}
              render={({ field: { onBlur, onChange, value } }) => (
                <QuestionAnswerField
                  disabled={isLocked}
                  error={getAnswerError(question.id)}
                  id={`answer-question-${index}`}
                  index={index}
                  question={question}
                  value={value}
                  onBlur={onBlur}
                  onChange={onChange}
                />
              )}
            />
          ))}
        </Box>

        {form.consentText && (
          <Box className="grid gap-2 rounded-lg border border-border p-4">
            <Label
              className="flex cursor-pointer items-start gap-3 font-normal"
              htmlFor="answer-consent"
            >
              <Checkbox
                aria-describedby={consentError ? 'answer-consent-error' : undefined}
                aria-invalid={Boolean(consentError)}
                className="mt-0.5"
                disabled={isLocked}
                id="answer-consent"
                {...register('consentAccepted')}
              />

              <Box className="grid gap-1">
                <Text className="text-sm font-semibold text-foreground">
                  {t('answer.consent.label')}
                </Text>

                <Text className="text-sm whitespace-pre-line text-muted-foreground">
                  {form.consentText}
                </Text>
              </Box>
            </Label>

            {consentError && (
              <Text className="text-sm text-destructive-strong" id="answer-consent-error">
                {consentError}
              </Text>
            )}
          </Box>
        )}

        {canAnswer && (
          <Label
            className="flex w-fit cursor-pointer items-center gap-2 font-normal"
            htmlFor="answer-send-copy"
          >
            <Checkbox disabled={isSubmitting} id="answer-send-copy" {...register('sendCopy')} />
            {t('answer.sendCopy', { email: recipient.email })}
          </Label>
        )}

        {draftRestored && (
          <Text className="text-xs text-muted-foreground" role="status">
            {t('answer.draftRestored')}
          </Text>
        )}

        {emptyError && (
          <Text className="text-sm text-destructive-strong" role="alert">
            {emptyError}
          </Text>
        )}

        {canAnswer && (
          <Button
            aria-busy={isSubmitting}
            className="h-11 w-full sm:ml-auto sm:w-auto sm:px-6"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <SendIcon data-icon="inline-start" />
            )}
            {isSubmitting
              ? t('answer.submitting')
              : t(isEditing ? 'answer.update' : 'answer.submit')}
          </Button>
        )}
      </Form>
    );
  };

  return (
    <Box className="relative min-h-dvh bg-background px-4 pt-20 pb-12 sm:px-6">
      <PreferencesControls className="absolute top-4 right-4 sm:right-6" tone="surface" />

      <Box className="mx-auto max-w-3xl rounded-2xl surface-card p-5 shadow-elevated-lg sm:p-8">
        {renderBody()}
      </Box>
    </Box>
  );
};
