import type { TranslationKey } from '@/app/i18n/translation-key';
import { authSessionQueryOptions } from '@/features/auth/application/queries/auth-session.query';
import {
  requestEmailChangeUseCase,
  type RequestEmailChangeInput,
} from '@/features/profile/application/use-cases/request-email-change.use-case';
import {
  changeEmailFormSchema,
  getSecurityNotice,
  type ChangeEmailFormData,
} from '@/features/profile/presentation/models/profile.model';
import { notify } from '@/shared/feedback/notify';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { get, useForm, type FieldPath } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

// Motivo informado pelo Dialog quando o fechamento vem do botão "X".
const CLOSE_BUTTON_REASON = 'close-press';

type UseChangeEmailViewModelOptions = {
  onOpenChange: (open: boolean) => void;
};

// Pede a troca do e-mail de acesso: o link vai para o novo e-mail, que só vale depois de aberto.
export const useChangeEmailViewModel = ({ onOpenChange }: UseChangeEmailViewModelOptions) => {
  const { t } = useTranslation('profile');

  const { data: session } = useQuery(authSessionQueryOptions);

  const form = useForm<ChangeEmailFormData>({
    resolver: zodResolver(changeEmailFormSchema),
    defaultValues: { newEmail: '', currentPassword: '' },
    mode: 'onTouched',
  });

  const {
    formState: { errors, isSubmitted, touchedFields },
    handleSubmit,
    register,
  } = form;

  const { isPending, mutate } = useMutation({
    mutationFn: (input: RequestEmailChangeInput) => requestEmailChangeUseCase(input),
    onSuccess: ({ message }, { newEmail }) => {
      onOpenChange(false);

      notify.success({
        title: t('changeEmail.success.title'),
        description: message ?? t('changeEmail.success.description', { email: newEmail }),
      });
    },
    onError: (error) => {
      const notice = getSecurityNotice(error);

      notify.error({
        title: t(`securityNotices.${notice}.title`),
        description: t(`securityNotices.${notice}.description`),
      });
    },
  });

  const getFieldError = (name: FieldPath<ChangeEmailFormData>) => {
    const message: unknown = get(errors, name)?.message;

    const isVisible = isSubmitted || Boolean(get(touchedFields, name));

    return typeof message === 'string' && isVisible
      ? t(message as TranslationKey<'profile'>)
      : undefined;
  };

  const handleOpenChange = (open: boolean, reason?: string) => {
    if (!open && (isPending || reason !== CLOSE_BUTTON_REASON)) {
      return;
    }

    onOpenChange(open);
  };

  const cancel = () => {
    if (!isPending) {
      onOpenChange(false);
    }
  };

  const submit = handleSubmit(({ currentPassword, newEmail }) => {
    if (isPending || !session) {
      return;
    }

    mutate({ csrfToken: session.csrfToken, currentPassword, newEmail });
  });

  return {
    cancel,
    fieldErrors: {
      newEmail: getFieldError('newEmail'),
      currentPassword: getFieldError('currentPassword'),
    },
    handleOpenChange,
    isSubmitting: isPending,
    register,
    submit,
  };
};
