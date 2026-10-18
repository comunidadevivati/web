import type { TranslationKey } from '@/app/i18n/translation-key';
import { requestPasswordResetUseCase } from '@/features/auth/application/use-cases/request-password-reset.use-case';
import { TooManyAttemptsError } from '@/features/auth/domain/auth-session';
import {
  forgotPasswordFormSchema,
  type ForgotPasswordFormData,
  type ForgotPasswordNotice,
} from '@/features/auth/presentation/models/forgot-password.model';
import { notify } from '@/shared/feedback/notify';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

// Motivo informado pelo Dialog quando o fechamento vem do botão "X".
const CLOSE_BUTTON_REASON = 'close-press';

type UseForgotPasswordViewModelOptions = {
  onOpenChange: (open: boolean) => void;
};

const getErrorNotice = (error: Error): ForgotPasswordNotice => {
  if (error instanceof TooManyAttemptsError) {
    return 'tooManyAttempts';
  }

  return 'unavailable';
};

export const useForgotPasswordViewModel = ({ onOpenChange }: UseForgotPasswordViewModelOptions) => {
  const { t } = useTranslation('auth');

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onTouched',
  });

  const {
    control,
    formState: { errors, isSubmitted, touchedFields },
    handleSubmit,
    reset,
  } = form;

  const { email } = useWatch({ control });

  const {
    data,
    isPending,
    isSuccess,
    mutate,
    reset: resetMutation,
    variables: sentEmail,
  } = useMutation({
    mutationFn: (recoveryEmail: string) => requestPasswordResetUseCase(recoveryEmail),
    // Falhas técnicas vão para um toast; a existência da conta nunca é revelada.
    onError: (requestError) => {
      const notice = getErrorNotice(requestError);

      notify.error({
        title: t(`forgotPassword.notices.${notice}.title`),
        description: t(`forgotPassword.notices.${notice}.description`),
      });
    },
  });

  // Mensagem de sucesso do BFF ou, sem ela, o texto padrão traduzido.
  const successTitle = data?.message ?? t('forgotPassword.success.title');

  // O erro aparece depois do envio ou ao sair do campo preenchido. A mensagem do Zod é uma chave de
  // tradução do namespace "auth".
  const emailErrorMessage = errors.email?.message;

  const isEmailErrorVisible = isSubmitted || (touchedFields.email && Boolean(email));

  const emailError =
    emailErrorMessage && isEmailErrorVisible
      ? t(emailErrorMessage as TranslationKey<'auth'>)
      : undefined;

  // O modal só fecha pelo botão "X" (Esc e clique fora são ignorados) e nunca durante o envio.
  const handleOpenChange = (open: boolean, reason?: string) => {
    if (!open && (isPending || reason !== CLOSE_BUTTON_REASON)) {
      return;
    }

    onOpenChange(open);
  };

  // Volta ao formulário vazio depois que o modal termina de fechar (sem piscar durante a animação).
  const handleOpenChangeComplete = (open: boolean) => {
    if (open) {
      return;
    }

    reset();

    resetMutation();
  };

  const submit = handleSubmit(({ email: recoveryEmail }) => {
    if (isPending) {
      return;
    }

    mutate(recoveryEmail);
  });

  return {
    emailError,
    form,
    handleOpenChange,
    handleOpenChangeComplete,
    isSent: isSuccess,
    isSubmitting: isPending,
    sentEmail: sentEmail ?? '',
    submit,
    successTitle,
  };
};
