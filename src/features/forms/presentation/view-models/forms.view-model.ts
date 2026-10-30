import { authSessionQueryOptions } from '@/features/auth/application/queries/auth-session.query';
import { LEADERSHIP_DEPARTMENT } from '@/features/departments/domain/department';
import {
  FORMS_QUERY_KEY,
  formsQueryOptions,
} from '@/features/forms/application/queries/forms.query';
import { changeFormStatusUseCase } from '@/features/forms/application/use-cases/change-form-status.use-case';
import { deleteFormUseCase } from '@/features/forms/application/use-cases/delete-form.use-case';
import { duplicateFormUseCase } from '@/features/forms/application/use-cases/duplicate-form.use-case';
import { purgeAnswersUseCase } from '@/features/forms/application/use-cases/purge-answers.use-case';
import { startEmailDispatchUseCase } from '@/features/forms/application/use-cases/start-email-dispatch.use-case';
import {
  canDeleteForm,
  canEditForm,
  canPurgeAnswers,
  canRemindPending,
  getFormEmailAction,
  getFormStatusActions,
  isSendingEmails,
  type Form,
  type FormPage,
} from '@/features/forms/domain/form';
import {
  formatCivilDate,
  getFormsNotice,
  getServerDetail,
  isEmailAction,
  type FormMenuAction,
  type FormStatusFilter,
} from '@/features/forms/presentation/models/forms.model';
import { useGlobalLoading } from '@/shared/feedback/global-loading';
import { notify } from '@/shared/feedback/notify';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

type StatusTarget = {
  form: Form;
  action: FormMenuAction;
};

// Enquanto algum formulário da lista estiver enviando e-mails, a lista é relida neste intervalo.
const SENDING_POLL_INTERVAL_MS = 3000;

const hasSending = (pages: { pages: FormPage[] } | undefined) =>
  pages?.pages.some(({ items }) => items.some((form) => isSendingEmails(form))) ?? false;

// Executa a ação confirmada no menu: envio de e-mails, apagar respostas ou mudança de status.
const runMenuAction = ({
  action,
  csrfToken,
  form,
  message,
}: {
  action: FormMenuAction;
  csrfToken: string;
  form: Form;
  message: string;
}) => {
  if (isEmailAction(action)) {
    return startEmailDispatchUseCase({
      csrfToken,
      id: form.id,
      kind: action === 'remindPending' ? 'REMINDER' : 'INVITE',
      message: message.trim() || null,
    });
  }

  if (action === 'purgeAnswers') {
    return purgeAnswersUseCase({ csrfToken, id: form.id });
  }

  return changeFormStatusUseCase({ csrfToken, form, action });
};

export const useFormsViewModel = () => {
  const { i18n, t } = useTranslation('forms');

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { data: session } = useQuery(authSessionQueryOptions);

  const [statusFilter, setStatusFilter] = useState<FormStatusFilter>('ALL');

  const [deleteTarget, setDeleteTarget] = useState<Form | null>(null);

  const [statusTarget, setStatusTarget] = useState<StatusTarget | null>(null);

  const [previewForm, setPreviewForm] = useState<Form | null>(null);

  // Mensagem opcional dos e-mails (convite, reenvio e lembrete).
  const [dispatchMessage, setDispatchMessage] = useState('');

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isPending,
    refetch,
  } = useInfiniteQuery({
    ...formsQueryOptions(LEADERSHIP_DEPARTMENT, statusFilter === 'ALL' ? null : statusFilter),
    refetchInterval: ({ state }) => (hasSending(state.data) ? SENDING_POLL_INTERVAL_MS : false),
  });

  const notifyFailure = (failure: Error) => {
    const notice = getFormsNotice(failure);

    notify.error({
      title: t(`notices.${notice}.title`),
      description: getServerDetail(failure) ?? t(`notices.${notice}.description`),
    });
  };

  const { isPending: isDeleting, mutate: mutateDelete } = useMutation({
    mutationFn: ({ csrfToken, id }: { csrfToken: string; id: string }) =>
      deleteFormUseCase({ csrfToken, id }),
    onSuccess: async (_result, { id }) => {
      const title = deleteTarget?.id === id ? deleteTarget.title : '';

      setDeleteTarget(null);

      notify.success({
        title: t('deleteDialog.success.title'),
        description: t('deleteDialog.success.description', { title }),
      });

      await queryClient.invalidateQueries({ queryKey: FORMS_QUERY_KEY });
    },
    onError: async (deleteError) => {
      setDeleteTarget(null);

      notifyFailure(deleteError);

      await queryClient.invalidateQueries({ queryKey: FORMS_QUERY_KEY });
    },
  });

  const { isPending: isChangingStatus, mutate: mutateStatus } = useMutation({
    mutationFn: ({
      csrfToken,
      target: { action, form },
    }: {
      csrfToken: string;
      target: StatusTarget;
    }) => runMenuAction({ action, csrfToken, form, message: dispatchMessage }),
    onSuccess: async ({ title }, { target }) => {
      setStatusTarget(null);

      notify.success({
        title: t(`statusActions.${target.action}.success.title`),
        description: t(`statusActions.${target.action}.success.description`, { title }),
      });

      await queryClient.invalidateQueries({ queryKey: FORMS_QUERY_KEY });
    },
    onError: async (statusError) => {
      setStatusTarget(null);

      notifyFailure(statusError);

      await queryClient.invalidateQueries({ queryKey: FORMS_QUERY_KEY });
    },
  });

  // Cópia não publicada, aberta em seguida no editor.
  const { isPending: isDuplicating, mutate: mutateDuplicate } = useMutation({
    mutationFn: ({ csrfToken, id }: { csrfToken: string; id: string }) =>
      duplicateFormUseCase({ csrfToken, id }),
    onSuccess: async ({ id, title }) => {
      await queryClient.invalidateQueries({ queryKey: FORMS_QUERY_KEY });

      notify.success({
        title: t('duplicate.success.title'),
        description: t('duplicate.success.description', { title }),
      });

      await navigate({
        to: '/departamentos/lideranca/formularios/$formId',
        params: { formId: id },
      });
    },
    onError: (duplicateError) => {
      notifyFailure(duplicateError);
    },
  });

  useGlobalLoading(isDeleting || isChangingStatus || isDuplicating);

  const forms = (data?.pages ?? []).flatMap(({ items: page }) => page);

  // Avisa quando um envio acompanhado pela lista termina (SENDING → SENT ou FAILED).
  const sendingIds = useRef(new Set<string>());

  useEffect(() => {
    forms.forEach(({ emailDispatch, id, title }) => {
      if (emailDispatch?.status === 'SENDING') {
        sendingIds.current.add(id);

        return;
      }

      if (!sendingIds.current.delete(id) || !emailDispatch) {
        return;
      }

      const { failedCount, sentCount, status } = emailDispatch;

      const notice = status === 'FAILED' || failedCount > 0 ? notify.error : notify.success;

      notice({
        title:
          status === 'FAILED' ? t('emailDispatch.failed.title') : t('emailDispatch.sent.title'),
        description: t('emailDispatch.result', { title, sent: sentCount, failed: failedCount }),
      });
    });
  }, [forms, t]);

  const formatPeriod = ({ endsOn, startsOn }: Form) => {
    return t('list.period', {
      start: formatCivilDate(startsOn, i18n.language),
      end: formatCivilDate(endsOn, i18n.language),
    });
  };

  // Cada item traz só as ações que o status atual permite (finalizado e cancelado só abrem para
  // leitura; publicado não pode ser excluído).
  const formatDateTime = (value: string) =>
    new Intl.DateTimeFormat(i18n.language, { dateStyle: 'short', timeStyle: 'short' }).format(
      new Date(value),
    );

  // Resumo do último envio e das respostas, abaixo dos dados do formulário.
  const getEmailSummary = ({ answeredCount, emailDispatch, invitedCount }: Form) => {
    if (!emailDispatch || emailDispatch.status === 'SENDING') {
      return null;
    }

    return t('list.emailSummary', {
      date: formatDateTime(emailDispatch.finishedAt ?? emailDispatch.startedAt),
      answered: answeredCount,
      invited: invitedCount,
    });
  };

  // Envio em andamento: o servidor informa SENDING; enquanto a requisição de início não volta, o
  // próprio pedido também bloqueia o formulário.
  const startingId =
    isChangingStatus && statusTarget && isEmailAction(statusTarget.action)
      ? statusTarget.form.id
      : null;

  const items = forms.map((form) => ({
    form,
    isSendingEmails: isSendingEmails(form) || startingId === form.id,
    emailAction: getFormEmailAction(form),
    canRemind: canRemindPending(form),
    canPurge: canPurgeAnswers(form),
    purgedSummary: form.answersPurgedAt
      ? t('list.answersPurged', { date: formatDateTime(form.answersPurgedAt) })
      : null,
    emailSummary: getEmailSummary(form),
    period: formatPeriod(form),
    questionCount: t('list.questionCount', { count: form.questions.length }),
    recipientCount: t('list.recipientGroupCount', { count: form.recipientGroupIds.length }),
    canEdit: canEditForm(form.status),
    canDelete: canDeleteForm(form.status),
    statusActions: getFormStatusActions(form.status),
  }));

  // Prévia de um formulário salvo, no mesmo formato da prévia do editor.
  const getPreview = (form: Form) => {
    return {
      headerImage: form.headerImage,
      title: form.title,
      description: form.description ?? '',
      period: formatPeriod(form),
      questions: form.questions.map(({ id, ...question }) => ({ key: id, ...question })),
      consentText: form.consentText,
    };
  };

  const changeStatusFilter = (value: FormStatusFilter | null) => {
    setStatusFilter(value ?? 'ALL');
  };

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  };

  const retry = () => {
    void refetch();
  };

  // O editor abre somente para leitura quando o status é final.
  const openForm = (form: Form) => {
    void navigate({
      to: '/departamentos/lideranca/formularios/$formId',
      params: { formId: form.id },
    });
  };

  // Quem recebeu o convite e quem respondeu (pelo link ou em papel).
  const openResponses = (form: Form) => {
    void navigate({
      to: '/departamentos/lideranca/formularios/$formId/respostas',
      params: { formId: form.id },
    });
  };

  const openReport = (form: Form) => {
    void navigate({
      to: '/departamentos/lideranca/formularios/$formId/relatorio',
      params: { formId: form.id },
    });
  };

  const openPreview = (form: Form) => {
    setPreviewForm(form);
  };

  const changePreviewOpen = (open: boolean) => {
    if (!open) {
      setPreviewForm(null);
    }
  };

  const duplicateForm = (form: Form) => {
    if (session && !isDuplicating) {
      mutateDuplicate({ csrfToken: session.csrfToken, id: form.id });
    }
  };

  const requestDelete = (form: Form) => {
    setDeleteTarget(form);
  };

  const cancelDelete = () => {
    setDeleteTarget(null);
  };

  const confirmDelete = () => {
    if (!deleteTarget || !session || isDeleting) {
      return;
    }

    mutateDelete({ csrfToken: session.csrfToken, id: deleteTarget.id });
  };

  const requestStatusChange = (form: Form, action: FormMenuAction) => {
    setDispatchMessage('');

    setStatusTarget({ form, action });
  };

  const cancelStatusChange = () => {
    setStatusTarget(null);
  };

  const confirmStatusChange = () => {
    if (!statusTarget || !session || isChangingStatus) {
      return;
    }

    mutateStatus({ csrfToken: session.csrfToken, target: statusTarget });
  };

  return {
    cancelDelete,
    cancelStatusChange,
    changePreviewOpen,
    changeStatusFilter,
    confirmDelete,
    confirmStatusChange,
    deleteTarget,
    duplicateForm,
    errorNotice: error ? getFormsNotice(error) : null,
    hasNextPage,
    isChangingStatus,
    isDeleting,
    isLoading: isPending,
    isLoadingMore: isFetchingNextPage,
    isRetrying: isFetching,
    items,
    loadMore,
    openForm,
    openReport,
    openResponses,
    openPreview,
    preview: previewForm ? getPreview(previewForm) : null,
    requestDelete,
    requestStatusChange,
    retry,
    statusFilter,
    changeDispatchMessage: setDispatchMessage,
    dispatchMessage,
    statusTarget: statusTarget
      ? { title: statusTarget.form.title, action: statusTarget.action }
      : null,
  };
};
