import type { TranslationKey } from '@/app/i18n/translation-key';
import { authSessionQueryOptions } from '@/features/auth/application/queries/auth-session.query';
import { ORGANIZATION_QUERY_KEY } from '@/features/organization/application/queries/organization.query';
import {
  updateOrganizationUseCase,
  type UpdateOrganizationInput,
} from '@/features/organization/application/use-cases/update-organization.use-case';
import {
  InvalidOrganizationDataError,
  OrganizationConflictError,
  type Organization,
} from '@/features/organization/domain/organization';
import type {
  AddressField,
  AddressFieldBinding,
} from '@/features/organization/presentation/components/address-fields';
import {
  getConflictDetail,
  getOrganizationNotice,
  organizationFormSchema,
  organizationValidationMessages,
  toOrganizationDetails,
  toOrganizationFormInput,
  type OrganizationFormData,
  type OrganizationFormInput,
} from '@/features/organization/presentation/models/organization.model';
import { notify } from '@/shared/feedback/notify';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { get, useForm, type FieldPath } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

// Motivo informado pelo Dialog quando o fechamento vem do botão "X".
const CLOSE_BUTTON_REASON = 'close-press';

const ADDRESS_FIELDS: AddressField[] = [
  'street',
  'number',
  'complement',
  'district',
  'city',
  'state',
  'postalCode',
];

type UseOrganizationFormViewModelOptions = {
  organization: Organization;
  onOpenChange: (open: boolean) => void;
};

export const useOrganizationFormViewModel = ({
  onOpenChange,
  organization,
}: UseOrganizationFormViewModelOptions) => {
  const { t } = useTranslation('organization');

  const queryClient = useQueryClient();

  const { data: session } = useQuery(authSessionQueryOptions);

  const form = useForm<OrganizationFormInput, unknown, OrganizationFormData>({
    resolver: zodResolver(organizationFormSchema),
    defaultValues: toOrganizationFormInput(organization),
    mode: 'onTouched',
  });

  const {
    formState: { errors, isSubmitted, touchedFields },
    getValues,
    handleSubmit,
    register,
    reset,
    setError,
  } = form;

  const {
    error,
    isPending,
    mutate,
    reset: resetMutation,
  } = useMutation({
    mutationFn: (input: UpdateOrganizationInput) => updateOrganizationUseCase(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ORGANIZATION_QUERY_KEY });

      onOpenChange(false);

      notify.success({
        title: t('organizationForm.success.title'),
        description: t('organizationForm.success.description'),
      });
    },
    onError: async (updateError) => {
      // Campos recusados pelo servidor ficam marcados no próprio formulário.
      if (updateError instanceof InvalidOrganizationDataError) {
        updateError.fields
          .filter((field) => typeof get(getValues(), field) === 'string')
          .forEach((field) => {
            setError(field as FieldPath<OrganizationFormInput>, {
              type: 'server',
              message: organizationValidationMessages.invalid,
            });
          });
      }

      // Dados alterados por outra operação: fecha o formulário e recarrega; ao reabrir, ele já vem
      // com os dados atuais.
      if (updateError instanceof OrganizationConflictError) {
        onOpenChange(false);

        notify.error({
          title: t('notices.conflict.title'),
          description: getConflictDetail(updateError) ?? t('notices.conflict.description'),
        });

        await queryClient.invalidateQueries({ queryKey: ORGANIZATION_QUERY_KEY });
      }
    },
  });

  const notice = error ? getOrganizationNotice(error) : null;

  // O erro aparece depois do envio ou ao sair de um campo preenchido.
  const getFieldError = (name: FieldPath<OrganizationFormInput>) => {
    const message: unknown = get(errors, name)?.message;

    const isVisible =
      isSubmitted || (Boolean(get(touchedFields, name)) && Boolean(getValues(name)));

    return typeof message === 'string' && isVisible
      ? t(message as TranslationKey<'organization'>)
      : undefined;
  };

  const fieldErrors = {
    legalName: getFieldError('legalName'),
    tradeName: getFieldError('tradeName'),
    cnpj: getFieldError('cnpj'),
    phone: getFieldError('phone'),
    email: getFieldError('email'),
  };

  const addressFields = Object.fromEntries(
    ADDRESS_FIELDS.map((field) => [
      field,
      {
        registration: register(`address.${field}`),
        error: getFieldError(`address.${field}`),
      },
    ]),
  ) as Record<AddressField, AddressFieldBinding>;

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

    mutate({
      csrfToken: session.csrfToken,
      version: organization.version,
      details: toOrganizationDetails(data),
    });
  });

  return {
    addressFields,
    fieldErrors,
    form,
    handleOpenChange,
    handleOpenChangeComplete,
    isSubmitting: isPending,
    notice,
    submit,
  };
};
