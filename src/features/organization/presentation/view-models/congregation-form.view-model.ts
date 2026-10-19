import type { TranslationKey } from '@/app/i18n/translation-key';
import { authSessionQueryOptions } from '@/features/auth/application/queries/auth-session.query';
import { ORGANIZATION_QUERY_KEY } from '@/features/organization/application/queries/organization.query';
import { registerCongregationUseCase } from '@/features/organization/application/use-cases/register-congregation.use-case';
import { updateCongregationUseCase } from '@/features/organization/application/use-cases/update-congregation.use-case';
import {
  InvalidOrganizationDataError,
  OrganizationConflictError,
  type Congregation,
} from '@/features/organization/domain/organization';
import type {
  AddressField,
  AddressFieldBinding,
} from '@/features/organization/presentation/components/address-fields';
import {
  congregationFormSchema,
  getConflictDetail,
  getOrganizationNotice,
  organizationValidationMessages,
  toCongregationDetails,
  toCongregationFormInput,
  toCongregationRegistration,
  type CongregationFormData,
  type CongregationFormInput,
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

type UseCongregationFormViewModelOptions = {
  // Congregação em edição; null registra uma nova.
  congregation: Congregation | null;
  onOpenChange: (open: boolean) => void;
};

export const useCongregationFormViewModel = ({
  congregation,
  onOpenChange,
}: UseCongregationFormViewModelOptions) => {
  const { t } = useTranslation('organization');

  const queryClient = useQueryClient();

  const { data: session } = useQuery(authSessionQueryOptions);

  const isEditing = congregation !== null;

  const form = useForm<CongregationFormInput, unknown, CongregationFormData>({
    resolver: zodResolver(congregationFormSchema),
    defaultValues: toCongregationFormInput(congregation),
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

  const save = ({ csrfToken, data }: { csrfToken: string; data: CongregationFormData }) => {
    if (!congregation) {
      return registerCongregationUseCase(csrfToken, toCongregationRegistration(data));
    }

    return updateCongregationUseCase({
      csrfToken,
      id: congregation.id,
      version: congregation.version,
      details: toCongregationDetails(data),
    });
  };

  const {
    error,
    isPending,
    mutate,
    reset: resetMutation,
  } = useMutation({
    mutationFn: save,
    onSuccess: async ({ name }) => {
      await queryClient.invalidateQueries({ queryKey: ORGANIZATION_QUERY_KEY });

      onOpenChange(false);

      notify.success({
        title: isEditing
          ? t('congregationForm.success.editTitle')
          : t('congregationForm.success.createTitle'),
        description: isEditing
          ? t('congregationForm.success.editDescription', { name })
          : t('congregationForm.success.createDescription', { name }),
      });
    },
    onError: async (saveError) => {
      // Campos recusados pelo servidor ficam marcados no próprio formulário.
      if (saveError instanceof InvalidOrganizationDataError) {
        saveError.fields
          .filter((field) => typeof get(getValues(), field) === 'string')
          .forEach((field) => {
            setError(field as FieldPath<CongregationFormInput>, {
              type: 'server',
              message: organizationValidationMessages.invalid,
            });
          });
      }

      // Na edição, um conflito indica dados desatualizados: fecha e recarrega a lista. No registro,
      // o conflito (ex.: código em uso, organização inativa) aparece no próprio formulário.
      if (saveError instanceof OrganizationConflictError && isEditing) {
        onOpenChange(false);

        notify.error({
          title: t('notices.conflict.title'),
          description: getConflictDetail(saveError) ?? t('notices.conflict.description'),
        });

        await queryClient.invalidateQueries({ queryKey: ORGANIZATION_QUERY_KEY });
      }
    },
  });

  const notice = error ? getOrganizationNotice(error) : null;

  const noticeDetail = getConflictDetail(error);

  // O erro aparece depois do envio ou ao sair de um campo preenchido.
  const getFieldError = (name: FieldPath<CongregationFormInput>) => {
    const message: unknown = get(errors, name)?.message;

    const isVisible =
      isSubmitted || (Boolean(get(touchedFields, name)) && Boolean(getValues(name)));

    return typeof message === 'string' && isVisible
      ? t(message as TranslationKey<'organization'>)
      : undefined;
  };

  const fieldErrors = {
    code: getFieldError('code'),
    name: getFieldError('name'),
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

    mutate({ csrfToken: session.csrfToken, data });
  });

  return {
    addressFields,
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
