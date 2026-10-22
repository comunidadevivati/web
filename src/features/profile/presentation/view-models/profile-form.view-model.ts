import type { TranslationKey } from '@/app/i18n/translation-key';
import { authSessionQueryOptions } from '@/features/auth/application/queries/auth-session.query';
import { profileQueryOptions } from '@/features/profile/application/queries/profile.query';
import {
  updateProfileUseCase,
  type UpdateProfileInput,
} from '@/features/profile/application/use-cases/update-profile.use-case';
import {
  InvalidProfileDataError,
  ProfileConflictError,
  SOCIAL_NETWORKS,
  type Profile,
} from '@/features/profile/domain/profile';
import {
  ADDRESS_FIELDS,
  formatPostalCodeFor,
  getTodayIso,
  getProfileNotice,
  profileFormSchema,
  profileValidationMessages,
  toProfileDetails,
  toProfileFormInput,
  type AddressField,
  type ProfileFormData,
  type ProfileFormInput,
} from '@/features/profile/presentation/models/profile.model';
import { notify } from '@/shared/feedback/notify';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { get, useForm, useWatch, type FieldPath } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

type UseProfileFormViewModelOptions = {
  profile: Profile;
};

// Formulário do cadastro (dados pessoais, endereço e redes sociais), gravado de uma vez.
export const useProfileFormViewModel = ({ profile }: UseProfileFormViewModelOptions) => {
  const { t } = useTranslation('profile');

  const queryClient = useQueryClient();

  const { data: session } = useQuery(authSessionQueryOptions);

  const form = useForm<ProfileFormInput, unknown, ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: toProfileFormInput(profile),
    mode: 'onTouched',
  });

  const {
    control,
    formState: { errors, isDirty, isSubmitted, touchedFields },
    getValues,
    handleSubmit,
    register,
    reset,
    setError,
  } = form;

  // Cadastro recarregado (outra aba, conflito): o formulário sem alterações acompanha.
  useEffect(() => {
    if (!isDirty) {
      reset(toProfileFormInput(profile));
    }
  }, [isDirty, profile, reset]);

  // Limite do seletor de data de nascimento.
  const [maxBirthDate] = useState(getTodayIso);

  const country = useWatch({ control, name: 'address.country' });

  const { isPending, mutate } = useMutation({
    mutationFn: (input: UpdateProfileInput) => updateProfileUseCase(input),
    onSuccess: async (saved) => {
      queryClient.setQueryData(profileQueryOptions.queryKey, saved);

      reset(toProfileFormInput(saved));

      // O nome do cabeçalho vem da sessão, atualizada pelo BFF junto com o Perfil.
      await queryClient.invalidateQueries({ queryKey: authSessionQueryOptions.queryKey });

      notify.success({
        title: t('success.saved.title'),
        description: t('success.saved.description'),
      });
    },
    onError: async (error) => {
      const notice = getProfileNotice(error);

      notify.error({
        title: t(`notices.${notice}.title`),
        description: t(`notices.${notice}.description`),
      });

      // Campos recusados pelo servidor ficam marcados no próprio formulário.
      if (error instanceof InvalidProfileDataError) {
        error.fields
          .filter((field) => typeof get(getValues(), field) === 'string')
          .forEach((field) => {
            setError(field as FieldPath<ProfileFormInput>, {
              type: 'server',
              message: profileValidationMessages.invalid,
            });
          });
      }

      // Alterado por outra operação: descarta a edição e recarrega o cadastro atual.
      if (error instanceof ProfileConflictError) {
        await queryClient.invalidateQueries({ queryKey: profileQueryOptions.queryKey });

        const current = queryClient.getQueryData(profileQueryOptions.queryKey);

        if (current) {
          reset(toProfileFormInput(current));
        }
      }
    },
  });

  // O erro aparece depois do envio ou ao sair de um campo preenchido.
  const getFieldError = (name: FieldPath<ProfileFormInput>) => {
    const message: unknown = get(errors, name)?.message;

    const isVisible =
      isSubmitted || (Boolean(get(touchedFields, name)) && Boolean(getValues(name)));

    return typeof message === 'string' && isVisible
      ? t(message as TranslationKey<'profile'>)
      : undefined;
  };

  const fieldErrors = {
    fullName: getFieldError('fullName'),
    sex: getFieldError('sex'),
    birthDate: getFieldError('birthDate'),
    phone: getFieldError('phone'),
    secondaryPhone: getFieldError('secondaryPhone'),
    secondaryEmail: getFieldError('secondaryEmail'),
  };

  const addressErrors = Object.fromEntries(
    ADDRESS_FIELDS.map((field) => [field, getFieldError(`address.${field}`)]),
  ) as Record<AddressField, string | undefined>;

  const socialErrors = Object.fromEntries(
    SOCIAL_NETWORKS.map((network) => [network, getFieldError(`socialLinks.${network}`)]),
  ) as Record<(typeof SOCIAL_NETWORKS)[number], string | undefined>;

  const formatPostalCode = (value: string) => {
    return formatPostalCodeFor(country, value);
  };

  const discard = () => {
    reset(toProfileFormInput(profile));
  };

  const submit = handleSubmit((data) => {
    if (isPending || !session) {
      return;
    }

    mutate({
      csrfToken: session.csrfToken,
      version: profile.version,
      details: toProfileDetails(data),
    });
  });

  return {
    addressErrors,
    control,
    discard,
    fieldErrors,
    formatPostalCode,
    isDirty,
    isSubmitting: isPending,
    maxBirthDate,
    register,
    socialErrors,
    submit,
  };
};
