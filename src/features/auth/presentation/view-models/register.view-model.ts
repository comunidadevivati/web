import type { TranslationKey } from '@/app/i18n/translation-key';
import { registerUseCase } from '@/features/auth/application/use-cases/register.use-case';
import { TooManyAttemptsError } from '@/features/auth/domain/auth-session';
import {
  EmailAlreadyRegisteredError,
  InvalidRegistrationError,
  type Registration,
} from '@/features/auth/domain/registration';
import {
  registerFormSchema,
  registerValidationMessages,
  type RegisterFormData,
  type RegisterFormInput,
  type RegisterNotice,
} from '@/features/auth/presentation/models/register.model';
import {
  getPasswordRequirements,
  getPasswordStrength,
  getPersonalInfoTerms,
} from '@/shared/validation/password-strength';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

// Motivo informado pelo Dialog quando o fechamento vem do botão "X".
const CLOSE_BUTTON_REASON = 'close-press';

type UseRegisterViewModelOptions = {
  onOpenChange: (open: boolean) => void;
  // Conta criada: recebe o e-mail cadastrado para preencher o login.
  onRegistered: (email: string) => void;
};

const getErrorNotice = (error: Error): RegisterNotice | null => {
  // E-mail já cadastrado é exibido no próprio campo.
  if (error instanceof EmailAlreadyRegisteredError) {
    return null;
  }

  if (error instanceof InvalidRegistrationError) {
    return 'invalidData';
  }

  if (error instanceof TooManyAttemptsError) {
    return 'tooManyAttempts';
  }

  return 'unavailable';
};

export const useRegisterViewModel = ({
  onOpenChange,
  onRegistered,
}: UseRegisterViewModelOptions) => {
  const { t } = useTranslation('auth');

  const form = useForm<RegisterFormInput, unknown, RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onTouched',
  });

  const {
    control,
    formState: { errors, isSubmitted, isValid, touchedFields },
    getFieldState,
    handleSubmit,
    register,
    reset,
    setError,
    trigger,
  } = form;

  const values = useWatch({ control });

  const { email = '', fullName = '', password = '' } = values;

  // Força calculada a cada digitação, considerando nome e e-mail informados.
  const passwordStrength = getPasswordStrength(password, getPersonalInfoTerms(fullName, email));

  const passwordRequirements = getPasswordRequirements(password);

  const {
    error,
    isPending,
    mutate,
    reset: resetMutation,
  } = useMutation({
    mutationFn: (registration: Registration) => registerUseCase(registration),
    onSuccess: (_data, registration) => {
      onRegistered(registration.email);
    },
    onError: (registrationError) => {
      if (registrationError instanceof EmailAlreadyRegisteredError) {
        setError(
          'email',
          {
            type: 'server',
            message: registerValidationMessages.emailTaken,
          },
          {
            shouldFocus: true,
          },
        );
      }
    },
  });

  const notice = error ? getErrorNotice(error) : null;

  const isSubmitDisabled = !isValid || isPending;

  // Ao alterar a senha, revalida a confirmação se ela já foi preenchida.
  const passwordRegistration = register('password', {
    onChange: () => {
      if (getFieldState('confirmPassword').isTouched) {
        void trigger('confirmPassword');
      }
    },
  });

  // O erro aparece depois do envio ou ao sair de um campo preenchido: percorrer campos vazios com
  // Tab não marca tudo como inválido. Mensagens do Zod são chaves de tradução do namespace "auth".
  const getFieldError = (name: keyof RegisterFormInput) => {
    const message = errors[name]?.message;

    const isVisible = isSubmitted || (touchedFields[name] && Boolean(values[name]));

    return message && isVisible ? t(message as TranslationKey<'auth'>) : undefined;
  };

  const fieldErrors = {
    fullName: getFieldError('fullName'),
    phone: getFieldError('phone'),
    email: getFieldError('email'),
    password: getFieldError('password'),
    confirmPassword: getFieldError('confirmPassword'),
  };

  // O modal só fecha pelo botão "X" (Esc e clique fora são ignorados, para não perder o que foi
  // digitado) e nunca durante o envio, para não perder o resultado do cadastro.
  const handleOpenChange = (open: boolean, reason?: string) => {
    if (!open && (isPending || reason !== CLOSE_BUTTON_REASON)) {
      return;
    }

    onOpenChange(open);
  };

  // Limpa o formulário depois que o modal termina de fechar (sem piscar durante a animação).
  const handleOpenChangeComplete = (open: boolean) => {
    if (open) {
      return;
    }

    reset();

    resetMutation();
  };

  const submit = handleSubmit(({ confirmPassword: _confirmPassword, ...registration }) => {
    if (isPending) {
      return;
    }

    mutate(registration);
  });

  return {
    fieldErrors,
    form,
    handleOpenChange,
    handleOpenChangeComplete,
    isSubmitDisabled,
    isSubmitting: isPending,
    notice,
    passwordRegistration,
    passwordRequirements,
    passwordStrength,
    submit,
  };
};
