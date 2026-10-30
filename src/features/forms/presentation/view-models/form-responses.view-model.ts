import { authSessionQueryOptions } from '@/features/auth/application/queries/auth-session.query';
import {
  FORMS_QUERY_KEY,
  formInvitationsQueryOptions,
  formQueryOptions,
} from '@/features/forms/application/queries/forms.query';
import { openAnswersPdfUseCase } from '@/features/forms/application/use-cases/open-answers-pdf.use-case';
import { openPaperAttachmentUseCase } from '@/features/forms/application/use-cases/open-paper-attachment.use-case';
import { registerPaperAnswerUseCase } from '@/features/forms/application/use-cases/register-paper-answer.use-case';
import { unmarkPaperAnswerUseCase } from '@/features/forms/application/use-cases/unmark-paper-answer.use-case';
import {
  checkPaperAttachment,
  type FormInvitationRecord,
  type PaperAttachmentIssue,
} from '@/features/forms/domain/form-response';
import {
  getInvitationState,
  invitationStateTones,
  toAnswerRows,
} from '@/features/forms/presentation/models/form-responses.model';
import {
  formatCivilDate,
  formatFileSize,
  getFormsNotice,
  getServerDetail,
} from '@/features/forms/presentation/models/forms.model';
import { useGlobalLoading } from '@/shared/feedback/global-loading';
import { notify } from '@/shared/feedback/notify';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const useFormResponsesViewModel = () => {
  const { formId } = useParams({
    from: '/_authenticated/departamentos/lideranca/formularios/$formId/respostas',
  });

  const { i18n, t } = useTranslation('forms');

  const queryClient = useQueryClient();

  const { data: session } = useQuery(authSessionQueryOptions);

  const formQuery = useQuery(formQueryOptions(formId));

  const invitationsQuery = useQuery(formInvitationsQueryOptions(formId));

  const form = formQuery.data;

  const questions = form?.questions ?? [];

  // Respostas abertas no diálogo, convite em registro de resposta em papel e desfazer.
  const [answersTarget, setAnswersTarget] = useState<FormInvitationRecord | null>(null);

  const [paperTarget, setPaperTarget] = useState<FormInvitationRecord | null>(null);

  const [paperFile, setPaperFile] = useState<File | null>(null);

  const [paperIssue, setPaperIssue] = useState<PaperAttachmentIssue | null>(null);

  const [unmarkTarget, setUnmarkTarget] = useState<FormInvitationRecord | null>(null);

  const formatDateTime = (value: string) =>
    new Intl.DateTimeFormat(i18n.language, { dateStyle: 'short', timeStyle: 'short' }).format(
      new Date(value),
    );

  const notifyFailure = (failure: Error) => {
    const notice = getFormsNotice(failure);

    notify.error({
      title: t(`notices.${notice}.title`),
      description: getServerDetail(failure) ?? t(`notices.${notice}.description`),
    });
  };

  const refresh = () => queryClient.invalidateQueries({ queryKey: FORMS_QUERY_KEY });

  const { isPending: isRegistering, mutate: mutateRegister } = useMutation({
    mutationFn: ({
      csrfToken,
      file,
      invitationId,
    }: {
      csrfToken: string;
      invitationId: string;
      file: File | null;
    }) => registerPaperAnswerUseCase({ csrfToken, formId, invitationId, file }),
    onSuccess: async ({ recipientName }) => {
      setPaperTarget(null);

      notify.success({
        title: t('responses.paper.success.title'),
        description: t('responses.paper.success.description', { name: recipientName }),
      });

      await refresh();
    },
    onError: async (registerError) => {
      notifyFailure(registerError);

      await refresh();
    },
  });

  const { isPending: isUnmarking, mutate: mutateUnmark } = useMutation({
    mutationFn: ({ csrfToken, invitationId }: { csrfToken: string; invitationId: string }) =>
      unmarkPaperAnswerUseCase({ csrfToken, formId, invitationId }),
    onSuccess: async ({ recipientName }) => {
      setUnmarkTarget(null);

      notify.success({
        title: t('responses.unmark.success.title'),
        description: t('responses.unmark.success.description', { name: recipientName }),
      });

      await refresh();
    },
    onError: async (unmarkError) => {
      setUnmarkTarget(null);

      notifyFailure(unmarkError);

      await refresh();
    },
  });

  useGlobalLoading(isRegistering || isUnmarking);

  const invitations = invitationsQuery.data ?? [];

  const items = invitations.map((invitation) => {
    const state = getInvitationState(invitation);

    return {
      invitation,
      state,
      stateLabel: t(`responses.states.${state}`),
      stateTone: invitationStateTones[state],
      // Situação de entrega do e-mail (webhook do Resend).
      delivery: invitation.deliveryStatus
        ? t(`responses.delivery.${invitation.deliveryStatus}`)
        : null,
      deliveryProblem: ['BOUNCED', 'COMPLAINED', 'FAILED'].includes(
        invitation.deliveryStatus ?? '',
      ),
      date: invitation.answeredAt
        ? t('responses.answeredAt', { date: formatDateTime(invitation.answeredAt) })
        : t('responses.sentAt', { date: formatDateTime(invitation.sentAt) }),
      attachment: invitation.paperAttachment
        ? `${invitation.paperAttachment.fileName} · ${formatFileSize(invitation.paperAttachment.byteSize, i18n.language)}`
        : null,
    };
  });

  const answeredCount = invitations.filter(({ status }) => status === 'ANSWERED').length;

  const getPeriod = () => {
    if (!form) {
      return '';
    }

    return t('list.period', {
      start: formatCivilDate(form.startsOn, i18n.language),
      end: formatCivilDate(form.endsOn, i18n.language),
    });
  };

  const period = getPeriod();

  const answersDialog = answersTarget && {
    recipientName: answersTarget.recipientName,
    recipientEmail: answersTarget.recipientEmail,
    answeredAt: answersTarget.answeredAt ? formatDateTime(answersTarget.answeredAt) : '',
    rows: toAnswerRows(questions, answersTarget.answers),
  };

  // Abre o PDF das respostas no visualizador do navegador (nova aba): a pessoa decide se só lê,
  // baixa ou imprime.
  const openPdf = () => {
    if (!answersTarget) {
      return;
    }

    if (!openAnswersPdfUseCase(formId, answersTarget.id)) {
      notifyTabBlocked();
    }
  };

  const notifyTabBlocked = () => {
    notify.error({
      title: t('responses.print.blocked.title'),
      description: t('responses.print.blocked.description'),
    });
  };

  // Abre o anexo numa nova aba, no visualizador do navegador (a pessoa decide se baixa ou imprime).
  const openAttachment = async (invitation: FormInvitationRecord) => {
    try {
      if (!(await openPaperAttachmentUseCase(formId, invitation.id))) {
        notifyTabBlocked();
      }
    } catch (error) {
      notifyFailure(error as Error);
    }
  };

  const openPaperDialog = (invitation: FormInvitationRecord) => {
    setPaperFile(null);

    setPaperIssue(null);

    setPaperTarget(invitation);
  };

  const selectPaperFile = (file: File) => {
    const issue = checkPaperAttachment(file);

    setPaperIssue(issue);

    setPaperFile(issue ? null : file);
  };

  const confirmPaper = () => {
    if (!paperTarget || !session || isRegistering) {
      return;
    }

    mutateRegister({ csrfToken: session.csrfToken, invitationId: paperTarget.id, file: paperFile });
  };

  const confirmUnmark = () => {
    if (!unmarkTarget || !session || isUnmarking) {
      return;
    }

    mutateUnmark({ csrfToken: session.csrfToken, invitationId: unmarkTarget.id });
  };

  return {
    answeredCount,
    answersDialog,
    closeAnswers: () => setAnswersTarget(null),
    closePaperDialog: () => setPaperTarget(null),
    closeUnmarkDialog: () => setUnmarkTarget(null),
    confirmPaper,
    confirmUnmark,
    openAttachment: (invitation: FormInvitationRecord) => void openAttachment(invitation),
    errorNotice: invitationsQuery.error ? getFormsNotice(invitationsQuery.error) : null,
    form,
    formId,
    invitedCount: invitations.length,
    isLoading: formQuery.isPending || invitationsQuery.isPending,
    isRegistering,
    isRetrying: invitationsQuery.isFetching,
    isUnmarking,
    items,
    openAnswers: setAnswersTarget,
    openPaperDialog,
    openUnmarkDialog: setUnmarkTarget,
    paperDialog: paperTarget && {
      recipientName: paperTarget.recipientName,
      hasAttachment: paperTarget.paperAttachment !== null,
      isPaper: paperTarget.answerChannel === 'PAPER',
    },
    paperFile: paperFile && {
      name: paperFile.name,
      size: formatFileSize(paperFile.size, i18n.language),
    },
    paperIssue,
    period,
    openPdf,
    retry: () => void invitationsQuery.refetch(),
    selectPaperFile,
    unmarkName: unmarkTarget?.recipientName ?? null,
  };
};
