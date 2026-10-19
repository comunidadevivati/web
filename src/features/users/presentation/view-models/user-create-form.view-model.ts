import type { TranslationKey } from '@/app/i18n/translation-key';
import { authSessionQueryOptions } from '@/features/auth/application/queries/auth-session.query';
import {
  registerFormSchema,
  type RegisterFormData,
  type RegisterFormInput,
} from '@/features/auth/presentation/models/register.model';
import { USERS_QUERY_KEY } from '@/features/users/application/queries/users.query';
import { createUserUseCase } from '@/features/users/application/use-cases/create-user.use-case';
import type { NewUser } from '@/features/users/domain/user';
import {
  getUsersErrorDetail,
  getUsersNotice,
} from '@/features/users/presentation/models/users.model';
import { notify } from '@/shared/feedback/notify';
import {
  getPasswordRequirements,
  getPasswordStrength,
  getPersonalInfoTerms,
} from '@/shared/validation/password-strength';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

// Motivo informado pelo Dialog quando o fechamento vem do botão "X".
const CLOSE_BUTTON_REASON = 'close-press';

type UseUserCreateFormViewModelOptions = {
  onOpenChange: (open: boolean) => void;
};

// Mesmo formulário e regras do cadastro da tela de login. A diferença é o resultado: a conta é criada
// sem abrir sessão para ela, e a sessão de quem cadastra continua a mesma.
export const useUserCreateFormViewModel = ({ onOpenChange }: UseUserCreateFormViewModelOptions) => {
  const { t: tAuth } = useTranslation('auth');

  const { t } = useTranslation('users');

  const queryClient = useQueryClient();

  const { data: session } = useQuery(authSessionQueryOptions);

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
    trigger,
  } = form;

  const values = useWatch({ control });

  const { email = '', fullName = '', password = '' } = values;

  const passwordStrength = getPasswordStrength(password, getPersonalInfoTerms(fullName, email));

  const passwordRequirements = getPasswordRequirements(password);

  const {
    isPending,
    mutate,
    reset: resetMutation,
  } = useMutation({
    mutationFn: ({ csrfToken, user }: { csrfToken: string; user: NewUser }) =>
      createUserUseCase(csrfToken, user),
    onSuccess: async ({ email: createdEmail }) => {
      await queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });

      onOpenChange(false);

      notify.success({
        title: t('createForm.success.title'),
        description: t('createForm.success.description', { email: createdEmail }),
      });
    },
    // A validação que vale é a do BFF (ex.: e-mail já cadastrado); a mensagem dele vai para o toast.
    onError: (createError) => {
      const notice = getUsersNotice(createError);

      notify.error({
        title: t(`notices.${notice}.title`),
        description: getUsersErrorDetail(createError) ?? t(`notices.${notice}.description`),
      });
    },
  });

  const isSubmitDisabled = !isValid || isPending;

  // Ao alterar a senha, revalida a confirmação se ela já foi preenchida.
  const passwordRegistration = register('password', {
    onChange: () => {
      if (getFieldState('confirmPassword').isTouched) {
        void trigger('confirmPassword');
      }
    },
  });

  // O erro aparece depois do envio ou ao sair de um campo preenchido. Mensagens do Zod são chaves
  // de tradução do namespace "auth" (as mesmas do cadastro).
  const getFieldError = (name: keyof RegisterFormInput) => {
    const message = errors[name]?.message;

    const isVisible = isSubmitted || (touchedFields[name] && Boolean(values[name]));

    return message && isVisible ? tAuth(message as TranslationKey<'auth'>) : undefined;
  };

  const fieldErrors = {
    fullName: getFieldError('fullName'),
    phone: getFieldError('phone'),
    email: getFieldError('email'),
    password: getFieldError('password'),
    confirmPassword: getFieldError('confirmPassword'),
  };

  // O modal só fecha pelo botão "X" e nunca durante o envio.
  const handleOpenChange = (open: boolean, reason?: string) => {
    if (!open && (isPending || reason !== CLOSE_BUTTON_REASON)) {
      return;
    }

    onOpenChange(open);
  };

  // Limpa o formulário (inclusive as senhas) depois que o modal termina de fechar.
  const handleOpenChangeComplete = (open: boolean) => {
    if (open) {
      return;
    }

    reset();

    resetMutation();
  };

  const submit = handleSubmit(({ confirmPassword: _confirmPassword, ...user }) => {
    if (isPending || !session) {
      return;
    }

    mutate({ csrfToken: session.csrfToken, user });
  });

  return {
    fieldErrors,
    form,
    handleOpenChange,
    handleOpenChangeComplete,
    isSubmitDisabled,
    isSubmitting: isPending,
    passwordRegistration,
    passwordRequirements,
    passwordStrength,
    submit,
  };
};
