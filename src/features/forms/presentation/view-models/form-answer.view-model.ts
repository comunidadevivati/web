import type { TranslationKey } from '@/app/i18n/translation-key';
import {
  answerDraftKeyUseCase,
  clearAnswerDraftUseCase,
  loadAnswerDraftUseCase,
  saveAnswerDraftUseCase,
} from '@/features/forms/application/use-cases/answer-draft.use-cases';
import { lookupInvitationUseCase } from '@/features/forms/application/use-cases/lookup-invitation.use-case';
import { submitAnswersUseCase } from '@/features/forms/application/use-cases/submit-answers.use-case';
import type { FormInvitation } from '@/features/forms/domain/form-answer';
import {
  canSubmitAnswers,
  createFormAnswerSchema,
  getFormAnswerNotice,
  toAnswerDraft,
  toAnswers,
  type AnswerDraft,
  type FormAnswerInput,
} from '@/features/forms/presentation/models/form-answer.model';
import { formatCivilDate } from '@/features/forms/presentation/models/forms.model';
import { useGlobalLoading } from '@/shared/feedback/global-loading';
import { notify } from '@/shared/feedback/notify';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

const invitationQueryKey = (token: string) => ['form-invitation', token] as const;

export const useFormAnswerViewModel = () => {
  const { token } = useSearch({ from: '/formularios/responder' });

  // O token fica só na memória desta tela e sai da barra de endereço e do histórico.
  const [answerToken] = useState(token);

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { i18n, t } = useTranslation('forms');

  useEffect(() => {
    if (token) {
      void navigate({ to: '/formularios/responder', search: {}, replace: true });
    }
  }, [navigate, token]);

  const {
    data: invitation,
    error,
    isFetching,
    isPending,
    refetch,
  } = useQuery({
    queryKey: invitationQueryKey(answerToken ?? ''),
    queryFn: () => lookupInvitationUseCase(answerToken ?? ''),
    enabled: Boolean(answerToken),
    retry: false,
  });

  const questions = invitation?.form.questions ?? [];

  const answerForm = useForm<FormAnswerInput>({
    resolver: zodResolver(createFormAnswerSchema(questions, Boolean(invitation?.form.consentText))),
    values: {
      answers: toAnswerDraft(questions, invitation?.answers ?? []),
      consentAccepted: false,
      sendCopy: true,
    },
    resetOptions: { keepDirtyValues: true },
  });

  const {
    control,
    formState: { errors, isDirty, isSubmitted },
    handleSubmit,
    setValue,
  } = answerForm;

  const canAnswer = invitation ? canSubmitAnswers(invitation) : false;

  // Rascunho automático neste navegador: recuperado ao abrir e salvo a cada alteração, até o envio.
  const [draftKey, setDraftKey] = useState<string | null>(null);

  const [draftChecked, setDraftChecked] = useState(false);

  const [draftRestored, setDraftRestored] = useState(false);

  useEffect(() => {
    if (answerToken) {
      void answerDraftKeyUseCase(answerToken).then(setDraftKey);
    }
  }, [answerToken]);

  useEffect(() => {
    if (!draftKey || !invitation || draftChecked) {
      return;
    }

    setDraftChecked(true);

    const draft = canSubmitAnswers(invitation)
      ? loadAnswerDraftUseCase<AnswerDraft>(draftKey)
      : null;

    if (!draft) {
      return;
    }

    // Só perguntas que ainda existem no formulário.
    invitation.form.questions.forEach(({ id }) => {
      const answer = draft[id];

      if (answer) {
        setValue(`answers.${id}`, answer, { shouldDirty: true });
      }
    });

    setDraftRestored(true);
  }, [draftChecked, draftKey, invitation, setValue]);

  const watchedAnswers = useWatch({ control, name: 'answers' });

  useEffect(() => {
    if (draftKey && draftChecked && canAnswer && isDirty) {
      saveAnswerDraftUseCase(draftKey, watchedAnswers);
    }
  }, [canAnswer, draftChecked, draftKey, isDirty, watchedAnswers]);

  const { isPending: isSubmitting, mutate } = useMutation({
    mutationFn: (input: FormAnswerInput) =>
      submitAnswersUseCase({
        token: answerToken ?? '',
        answers: toAnswers(questions, input.answers),
        consentAccepted: input.consentAccepted,
        sendCopy: input.sendCopy,
      }),
    onSuccess: (answered: FormInvitation, { sendCopy }) => {
      if (draftKey) {
        clearAnswerDraftUseCase(draftKey);
      }

      setDraftRestored(false);

      queryClient.setQueryData(invitationQueryKey(answerToken ?? ''), answered);

      notify.success({
        title: t('answer.success.title'),
        description: sendCopy ? t('answer.success.withCopy') : t('answer.success.description'),
      });
    },
    onError: async (submitError) => {
      const notice = getFormAnswerNotice(submitError);

      notify.error({
        title: t(`answer.notices.${notice}.title`),
        description: t(`answer.notices.${notice}.description`),
      });

      // Já respondido ou fora do período: recarrega para mostrar a situação atual.
      await refetch();
    },
  });

  useGlobalLoading(isSubmitting);

  // Erro da resposta de uma pergunta (obrigatória, número ou data inválidos, texto longo).
  const getAnswerError = (questionId: string) => {
    const message = errors.answers?.[questionId]?.message;

    return message && isSubmitted ? t(message as TranslationKey<'forms'>) : undefined;
  };

  const getConsentError = () => {
    const message = errors.consentAccepted?.message;

    return message && isSubmitted ? t(message as TranslationKey<'forms'>) : undefined;
  };

  // Nenhuma pergunta respondida (erro do formulário todo).
  const getEmptyError = () => {
    const message = errors.answers?.root?.message ?? errors.answers?.message;

    return message && isSubmitted ? t(message as TranslationKey<'forms'>) : undefined;
  };

  const getPeriod = () => {
    if (!invitation) {
      return '';
    }

    return t('list.period', {
      start: formatCivilDate(invitation.form.startsOn, i18n.language),
      end: formatCivilDate(invitation.form.endsOn, i18n.language),
    });
  };

  const getAnsweredAt = () => {
    if (!invitation?.answeredAt) {
      return null;
    }

    return new Intl.DateTimeFormat(i18n.language, { dateStyle: 'long', timeStyle: 'short' }).format(
      new Date(invitation.answeredAt),
    );
  };

  const submit = handleSubmit(
    (input) => {
      if (!isSubmitting) {
        mutate(input);
      }
    },
    () => {
      notify.error({
        title: t('answer.notices.invalidAnswers.title'),
        description: t('answer.notices.invalidAnswers.description'),
      });
    },
  );

  return {
    answerForm,
    answeredAt: getAnsweredAt(),
    canAnswer,
    draftRestored,
    consentError: getConsentError(),
    emptyError: getEmptyError(),
    errorNotice: error ? getFormAnswerNotice(error) : null,
    getAnswerError,
    // Já respondido e editável: o envio substitui a resposta.
    isEditing: invitation?.status === 'ANSWERED' && canSubmitAnswers(invitation),
    invitation,
    isLinkMissing: !answerToken,
    isLoading: Boolean(answerToken) && isPending,
    isRetrying: isFetching,
    isSubmitting,
    period: getPeriod(),
    retry: () => void refetch(),
    submit,
  };
};
