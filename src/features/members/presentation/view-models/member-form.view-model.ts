import type { TranslationKey } from '@/app/i18n/translation-key';
import { authSessionQueryOptions } from '@/features/auth/application/queries/auth-session.query';
import { MEMBERS_QUERY_KEY } from '@/features/members/application/queries/members.query';
import { registerMemberUseCase } from '@/features/members/application/use-cases/register-member.use-case';
import { updateMemberUseCase } from '@/features/members/application/use-cases/update-member.use-case';
import {
  InvalidMemberDataError,
  MemberConflictError,
  type Member,
} from '@/features/members/domain/member';
import {
  getConflictDetail,
  getMembersNotice,
  memberFormSchema,
  membersValidationMessages,
  toMemberFormInput,
  toMemberProfile,
  type MemberFormData,
  type MemberFormInput,
} from '@/features/members/presentation/models/members.model';
import { notify } from '@/shared/feedback/notify';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

// Motivo informado pelo Dialog quando o fechamento vem do botão "X".
const CLOSE_BUTTON_REASON = 'close-press';

const FORM_FIELDS = ['fullName', 'birthDate', 'phone', 'email'] as const;

type UseMemberFormViewModelOptions = {
  // Membro em edição; null registra um novo.
  member: Member | null;
  onOpenChange: (open: boolean) => void;
};

export const useMemberFormViewModel = ({ member, onOpenChange }: UseMemberFormViewModelOptions) => {
  const { t } = useTranslation('members');

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { data: session } = useQuery(authSessionQueryOptions);

  const isEditing = member !== null;

  const form = useForm<MemberFormInput, unknown, MemberFormData>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: toMemberFormInput(member),
    mode: 'onTouched',
  });

  const {
    formState: { errors, isSubmitted, touchedFields },
    getValues,
    handleSubmit,
    reset,
    setError,
  } = form;

  const save = ({ csrfToken, data }: { csrfToken: string; data: MemberFormData }) => {
    const profile = toMemberProfile(data);

    return member
      ? updateMemberUseCase({ csrfToken, id: member.id, version: member.version, profile })
      : registerMemberUseCase(csrfToken, profile);
  };

  const {
    error,
    isPending,
    mutate,
    reset: resetMutation,
  } = useMutation({
    mutationFn: save,
    onSuccess: async ({ fullName: name, id }) => {
      await queryClient.invalidateQueries({ queryKey: MEMBERS_QUERY_KEY });

      onOpenChange(false);

      notify.success({
        title: isEditing ? t('memberForm.success.editTitle') : t('memberForm.success.createTitle'),
        description: isEditing
          ? t('memberForm.success.editDescription', { name })
          : t('memberForm.success.createDescription', { name }),
      });

      // Recém-registrado: segue para a ficha, onde os vínculos são adicionados.
      if (!isEditing) {
        await navigate({ to: '/membros/$memberId', params: { memberId: id } });
      }
    },
    onError: async (saveError) => {
      // Campos recusados pelo servidor ficam marcados no próprio formulário.
      if (saveError instanceof InvalidMemberDataError) {
        saveError.fields
          .filter((field): field is (typeof FORM_FIELDS)[number] =>
            (FORM_FIELDS as readonly string[]).includes(field),
          )
          .forEach((field) => {
            setError(field, { type: 'server', message: membersValidationMessages.invalid });
          });
      }

      // Na edição, um conflito indica dados desatualizados: fecha e recarrega.
      if (saveError instanceof MemberConflictError && isEditing) {
        onOpenChange(false);

        notify.error({
          title: t('notices.conflict.title'),
          description: getConflictDetail(saveError) ?? t('notices.conflict.description'),
        });

        await queryClient.invalidateQueries({ queryKey: MEMBERS_QUERY_KEY });
      }
    },
  });

  const notice = error ? getMembersNotice(error) : null;

  const noticeDetail = getConflictDetail(error);

  // O erro aparece depois do envio ou ao sair de um campo preenchido.
  const getFieldError = (name: (typeof FORM_FIELDS)[number]) => {
    const message = errors[name]?.message;

    const isVisible = isSubmitted || (Boolean(touchedFields[name]) && Boolean(getValues(name)));

    return message && isVisible ? t(message as TranslationKey<'members'>) : undefined;
  };

  const fieldErrors = {
    fullName: getFieldError('fullName'),
    birthDate: getFieldError('birthDate'),
    phone: getFieldError('phone'),
    email: getFieldError('email'),
  };

  // O modal só fecha pelo botão "X" e nunca durante o envio.
  const handleOpenChange = (open: boolean, reason?: string) => {
    if (!open && (isPending || reason !== CLOSE_BUTTON_REASON)) {
      return;
    }

    onOpenChange(open);
  };

  // Descarta o que não foi salvo depois que o modal termina de fechar.
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
    fieldErrors,
    form,
    handleOpenChange,
    handleOpenChangeComplete,
    isEditing,
    isSubmitting: isPending,
    notice,
    noticeDetail,
    submit,
  };
};
