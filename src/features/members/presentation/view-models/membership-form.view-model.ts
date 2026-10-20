import type { TranslationKey } from '@/app/i18n/translation-key';
import { authSessionQueryOptions } from '@/features/auth/application/queries/auth-session.query';
import { MEMBERS_QUERY_KEY } from '@/features/members/application/queries/members.query';
import { registerMembershipUseCase } from '@/features/members/application/use-cases/register-membership.use-case';
import { InvalidMemberDataError, type Member } from '@/features/members/domain/member';
import {
  getConflictDetail,
  getMembersNotice,
  membershipFormSchema,
  membersValidationMessages,
  type MembershipFormData,
  type MembershipFormInput,
} from '@/features/members/presentation/models/members.model';
import { congregationOptionsQueryOptions } from '@/features/organization/application/queries/organization.query';
import { notify } from '@/shared/feedback/notify';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

// Motivo informado pelo Dialog quando o fechamento vem do botão "X".
const CLOSE_BUTTON_REASON = 'close-press';

type UseMembershipFormViewModelOptions = {
  member: Member;
  onOpenChange: (open: boolean) => void;
};

export const useMembershipFormViewModel = ({
  member,
  onOpenChange,
}: UseMembershipFormViewModelOptions) => {
  const { t } = useTranslation('members');

  const queryClient = useQueryClient();

  const { data: session } = useQuery(authSessionQueryOptions);

  // Somente congregações ativas aceitam novos vínculos.
  const { data: congregations = [], isPending: isLoadingCongregations } = useQuery(
    congregationOptionsQueryOptions,
  );

  const congregationOptions = congregations
    .filter(({ status }) => status === 'ACTIVE')
    .map(({ code, id, name }) => ({ value: id, label: `${name} (${code})` }));

  const form = useForm<MembershipFormInput, unknown, MembershipFormData>({
    resolver: zodResolver(membershipFormSchema),
    defaultValues: { congregationId: '', primary: false },
    mode: 'onTouched',
  });

  const {
    formState: { errors, isSubmitted },
    handleSubmit,
    reset,
    setError,
  } = form;

  const {
    error,
    isPending,
    mutate,
    reset: resetMutation,
  } = useMutation({
    mutationFn: ({ csrfToken, data }: { csrfToken: string; data: MembershipFormData }) =>
      registerMembershipUseCase(csrfToken, member.id, data),
    onSuccess: async ({ congregation }) => {
      await queryClient.invalidateQueries({ queryKey: MEMBERS_QUERY_KEY });

      onOpenChange(false);

      notify.success({
        title: t('membershipForm.success.title'),
        description: t('membershipForm.success.description', {
          congregation: congregation?.name ?? '',
        }),
      });
    },
    onError: (saveError) => {
      if (
        saveError instanceof InvalidMemberDataError &&
        saveError.fields.includes('congregationId')
      ) {
        setError('congregationId', { type: 'server', message: membersValidationMessages.invalid });
      }
    },
  });

  const notice = error ? getMembersNotice(error) : null;

  const noticeDetail = getConflictDetail(error);

  const congregationMessage = errors.congregationId?.message;

  const congregationError =
    congregationMessage && isSubmitted
      ? t(congregationMessage as TranslationKey<'members'>)
      : undefined;

  // O modal só fecha pelo botão "X" e nunca durante o envio.
  const handleOpenChange = (open: boolean, reason?: string) => {
    if (!open && (isPending || reason !== CLOSE_BUTTON_REASON)) {
      return;
    }

    onOpenChange(open);
  };

  const handleOpenChangeComplete = (open: boolean) => {
    if (open) {
      return;
    }

    reset();

    resetMutation();
  };

  const submit = handleSubmit((data) => {
    if (isPending || !session) {
      return;
    }

    mutate({ csrfToken: session.csrfToken, data });
  });

  return {
    congregationError,
    congregationOptions,
    form,
    handleOpenChange,
    handleOpenChangeComplete,
    hasNoCongregations: !isLoadingCongregations && congregationOptions.length === 0,
    isSubmitting: isPending,
    notice,
    noticeDetail,
    submit,
  };
};
