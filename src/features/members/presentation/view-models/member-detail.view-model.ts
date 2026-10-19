import { authSessionQueryOptions } from '@/features/auth/application/queries/auth-session.query';
import {
  MEMBERS_QUERY_KEY,
  memberQueryOptions,
  membershipsQueryOptions,
} from '@/features/members/application/queries/members.query';
import { changeMemberStatusUseCase } from '@/features/members/application/use-cases/change-member-status.use-case';
import { changeMembershipStatusUseCase } from '@/features/members/application/use-cases/change-membership-status.use-case';
import {
  MemberConflictError,
  type Member,
  type Membership,
} from '@/features/members/domain/member';
import type { ConfirmActionContent } from '@/features/members/presentation/components/confirm-action-dialog';
import {
  getConflictDetail,
  getMembersNotice,
  memberActionsByStatus,
  type MembersActionRequest,
} from '@/features/members/presentation/models/members.model';
import { notify } from '@/shared/feedback/notify';
import { formatPhone } from '@/shared/validation/brazilian-phone';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

// Ações que retiram algo de uso recebem botão destrutivo.
const DESTRUCTIVE_ACTIONS = new Set(['deactivate', 'archive']);

export const useMemberDetailViewModel = () => {
  const { memberId } = useParams({ from: '/_authenticated/membros/$memberId' });

  const { i18n, t } = useTranslation('members');

  const queryClient = useQueryClient();

  const { data: session } = useQuery(authSessionQueryOptions);

  const {
    data: member,
    error,
    isFetching,
    isPending,
    refetch,
  } = useQuery(memberQueryOptions(memberId));

  const {
    data: memberships = [],
    error: membershipsError,
    isPending: isLoadingMemberships,
  } = useQuery({ ...membershipsQueryOptions(memberId), enabled: Boolean(member) });

  const [isEditOpen, setIsEditOpen] = useState(false);

  const [isMembershipFormOpen, setIsMembershipFormOpen] = useState(false);

  // Cada abertura monta um formulário novo, com os dados atuais.
  const [formKey, setFormKey] = useState(0);

  const [actionRequest, setActionRequest] = useState<MembersActionRequest | null>(null);

  const refresh = () => {
    return queryClient.invalidateQueries({ queryKey: MEMBERS_QUERY_KEY });
  };

  const runAction = ({
    csrfToken,
    request,
  }: {
    csrfToken: string;
    request: MembersActionRequest;
  }): Promise<Member | Membership> => {
    return request.kind === 'member'
      ? changeMemberStatusUseCase(csrfToken, memberId, request.action)
      : changeMembershipStatusUseCase(csrfToken, request.membershipId, request.action);
  };

  const { isPending: isRunningAction, mutate } = useMutation({
    mutationFn: runAction,
    onSuccess: async (_result, { request }) => {
      setActionRequest(null);

      await refresh();

      notify.success({
        title:
          request.kind === 'member'
            ? t(`confirm.success.member.${request.action}`)
            : t(`confirm.success.membership.${request.action}`),
      });
    },
    onError: async (actionError) => {
      setActionRequest(null);

      const notice = getMembersNotice(actionError);

      notify.error({
        title: t(`notices.${notice}.title`),
        description: getConflictDetail(actionError) ?? t(`notices.${notice}.description`),
      });

      if (actionError instanceof MemberConflictError) {
        await refresh();
      }
    },
  });

  // Data civil ISO exibida no idioma atual, sem deslocamento de fuso.
  const dateFormatter = new Intl.DateTimeFormat(i18n.language, { timeZone: 'UTC' });

  const formatDate = (iso: string) => {
    return dateFormatter.format(new Date(`${iso}T00:00:00Z`));
  };

  const profile = member && {
    birthDate: member.birthDate ? formatDate(member.birthDate) : null,
    phone: member.phone ? formatPhone(member.phone) : null,
    email: member.email,
  };

  const membershipItems = memberships.map((membership) => ({
    membership,
    congregationName: membership.congregation?.name ?? t('detailPage.removedCongregation'),
    congregationCode: membership.congregation?.code ?? null,
    startedOn: membership.startedOn
      ? t('detailPage.startedOn', { date: formatDate(membership.startedOn) })
      : null,
    endedOn: membership.endedOn
      ? t('detailPage.endedOn', { date: formatDate(membership.endedOn) })
      : null,
  }));

  const memberActions = member ? memberActionsByStatus[member.status] : [];

  const openEdit = () => {
    setFormKey((key) => key + 1);

    setIsEditOpen(true);
  };

  const openMembershipForm = () => {
    setFormKey((key) => key + 1);

    setIsMembershipFormOpen(true);
  };

  const requestMembershipAction = (
    { id }: Membership,
    action: 'activate' | 'deactivate',
    congregationName: string,
  ) => {
    setActionRequest({ kind: 'membership', action, membershipId: id, congregationName });
  };

  // Textos da confirmação em andamento (membro ou vínculo).
  const getConfirmContent = (request: MembersActionRequest): ConfirmActionContent => {
    if (request.kind === 'member') {
      return {
        title: t(`confirm.member.${request.action}.title`, { name: member?.fullName ?? '' }),
        description: t(`confirm.member.${request.action}.description`),
        confirmLabel: t(`actions.${request.action}`),
        isDestructive: DESTRUCTIVE_ACTIONS.has(request.action),
      };
    }

    const isActivation = request.action === 'activate';

    return {
      title: t(`confirm.membership.${request.action}.title`, {
        congregation: request.congregationName,
      }),
      description: t(`confirm.membership.${request.action}.description`),
      confirmLabel: isActivation ? t('actions.activate') : t('actions.end'),
      isDestructive: !isActivation,
    };
  };

  const confirmContent = actionRequest ? getConfirmContent(actionRequest) : null;

  const cancelAction = () => {
    setActionRequest(null);
  };

  const confirmAction = () => {
    if (!actionRequest || !session || isRunningAction) {
      return;
    }

    mutate({ csrfToken: session.csrfToken, request: actionRequest });
  };

  const retry = () => {
    void refetch();
  };

  return {
    cancelAction,
    canAddMembership: member?.status === 'ACTIVE',
    canEdit: member !== undefined && member.status !== 'ARCHIVED',
    confirmAction,
    confirmContent,
    errorNotice: error ? getMembersNotice(error) : null,
    formKey,
    hasMembershipsError: Boolean(membershipsError),
    isEditOpen,
    isLoading: isPending,
    isLoadingMemberships: Boolean(member) && isLoadingMemberships,
    isMembershipFormOpen,
    isRetrying: isFetching,
    isRunningAction,
    member,
    memberActions,
    membershipItems,
    openEdit,
    openMembershipForm,
    profile,
    requestMemberAction: (action: (typeof memberActions)[number]) => {
      setActionRequest({ kind: 'member', action });
    },
    requestMembershipAction,
    retry,
    setIsEditOpen,
    setIsMembershipFormOpen,
  };
};
