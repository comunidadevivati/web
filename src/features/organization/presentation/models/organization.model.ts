import type { TranslationKey } from '@/app/i18n/translation-key';
import {
  InvalidOrganizationDataError,
  OrganizationAccessDeniedError,
  OrganizationConflictError,
  OrganizationNotFoundError,
  type Congregation,
  type CongregationDetails,
  type CongregationRegistration,
  type CongregationStatus,
  type Organization,
  type OrganizationDetails,
  type OrganizationStatus,
  type PostalAddress,
  type StatusAction,
} from '@/features/organization/domain/organization';
import {
  formatCnpj,
  formatPostalCode,
  getCnpjDigits,
  getPostalCodeDigits,
  isBrazilianState,
  isValidCnpj,
  isValidPostalCode,
} from '@/shared/validation/brazilian-address';
import {
  formatPhone,
  getBrazilianPhoneIssue,
  getPhoneDigits,
} from '@/shared/validation/brazilian-phone';
import { z } from 'zod';

// Limites da Core API.
export const NAME_MAX_LENGTH = 200;

export const STREET_MAX_LENGTH = 200;

export const ADDRESS_NUMBER_MAX_LENGTH = 20;

export const ADDRESS_TEXT_MAX_LENGTH = 100;

export const EMAIL_MAX_LENGTH = 254;

export const CODE_MAX_LENGTH = 20;

export const CONGREGATION_STATUS_FILTERS = ['ALL', 'ACTIVE', 'DRAFT', 'INACTIVE'] as const;

export type CongregationStatusFilter = (typeof CONGREGATION_STATUS_FILTERS)[number];

export type EntityStatus = OrganizationStatus | CongregationStatus;

// Falhas exibidas em Alert nos formulários e em toast nas ações de situação.
export type OrganizationNotice =
  | 'invalidData'
  | 'conflict'
  | 'notFound'
  | 'accessDenied'
  | 'unavailable';

export const getOrganizationNotice = (error: Error): OrganizationNotice => {
  if (error instanceof InvalidOrganizationDataError) {
    return 'invalidData';
  }

  if (error instanceof OrganizationConflictError) {
    return 'conflict';
  }

  if (error instanceof OrganizationNotFoundError) {
    return 'notFound';
  }

  if (error instanceof OrganizationAccessDeniedError) {
    return 'accessDenied';
  }

  return 'unavailable';
};

// Explicação do servidor para um conflito (ex.: código já em uso), quando houver.
export const getConflictDetail = (error: Error | null) => {
  return error instanceof OrganizationConflictError ? error.detail : undefined;
};

// Pedido de mudança de situação aguardando confirmação.
export type StatusChangeRequest = {
  action: StatusAction;
  // Nome exibido na confirmação (nome fantasia ou nome da congregação).
  name: string;
  // Congregação alvo; ausente quando é a própria organização.
  congregationId?: string;
};

// Mensagens de validação: chaves de tradução do namespace "organization".
export const organizationValidationMessages = {
  required: 'validation.required',
  tooLong: 'validation.tooLong',
  invalid: 'validation.invalid',
  cnpjInvalid: 'validation.cnpjInvalid',
  postalCodeInvalid: 'validation.postalCodeInvalid',
  stateInvalid: 'validation.stateInvalid',
  emailInvalid: 'validation.emailInvalid',
  codeInvalid: 'validation.codeInvalid',
  phoneIncomplete: 'validation.phoneIncomplete',
  phoneInvalidAreaCode: 'validation.phoneInvalidAreaCode',
  phoneInvalidNumber: 'validation.phoneInvalidNumber',
} as const satisfies Record<string, TranslationKey<'organization'>>;

const messages = organizationValidationMessages;

const phoneIssueMessages = {
  incomplete: messages.phoneIncomplete,
  invalidAreaCode: messages.phoneInvalidAreaCode,
  invalidNumber: messages.phoneInvalidNumber,
} as const;

const requiredText = (max: number) => {
  return z.string().trim().min(1, messages.required).max(max, messages.tooLong);
};

const optionalText = (max: number) => {
  return z.string().trim().max(max, messages.tooLong);
};

const cnpjSchema = z
  .string()
  .refine((value) => isValidCnpj(value), messages.cnpjInvalid)
  .transform(getCnpjDigits);

const phoneSchema = z
  .string()
  .superRefine((value, context) => {
    const issue = getBrazilianPhoneIssue(value);

    if (issue) {
      context.addIssue({ code: 'custom', message: phoneIssueMessages[issue] });
    }
  })
  .transform(getPhoneDigits);

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .max(EMAIL_MAX_LENGTH, messages.tooLong)
  .pipe(z.email(messages.emailInvalid));

// Campo opcional: vazio vira null; preenchido, segue a regra do campo.
const optional = <T extends z.ZodType<string, string>>(schema: T) => {
  return z
    .string()
    .trim()
    .transform((value) => (value === '' ? null : value))
    .pipe(schema.nullable());
};

const addressSchema = z.object({
  street: requiredText(STREET_MAX_LENGTH),
  number: requiredText(ADDRESS_NUMBER_MAX_LENGTH),
  complement: optionalText(ADDRESS_TEXT_MAX_LENGTH).transform((value) => value || null),
  district: requiredText(ADDRESS_TEXT_MAX_LENGTH),
  city: requiredText(ADDRESS_TEXT_MAX_LENGTH),
  state: z
    .string()
    .trim()
    .toUpperCase()
    .refine((value) => isBrazilianState(value), messages.stateInvalid),
  postalCode: z
    .string()
    .refine((value) => isValidPostalCode(value), messages.postalCodeInvalid)
    .transform(getPostalCodeDigits),
});

export const organizationFormSchema = z.object({
  legalName: requiredText(NAME_MAX_LENGTH),
  tradeName: requiredText(NAME_MAX_LENGTH),
  cnpj: cnpjSchema,
  phone: phoneSchema,
  email: emailSchema,
  address: addressSchema,
});

// O código só é informado no registro; na edição ele aparece bloqueado (é estável).
export const congregationFormSchema = z.object({
  code: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z0-9](?:[A-Z0-9-]{0,18}[A-Z0-9])$/, messages.codeInvalid),
  name: requiredText(NAME_MAX_LENGTH),
  cnpj: optional(cnpjSchema),
  phone: optional(phoneSchema),
  email: optional(emailSchema),
  address: addressSchema,
});

export type OrganizationFormInput = z.input<typeof organizationFormSchema>;

export type OrganizationFormData = z.output<typeof organizationFormSchema>;

export type CongregationFormInput = z.input<typeof congregationFormSchema>;

export type CongregationFormData = z.output<typeof congregationFormSchema>;

export type AddressFormInput = OrganizationFormInput['address'];

const toAddressInput = ({ complement, postalCode, ...address }: PostalAddress) => ({
  ...address,
  complement: complement ?? '',
  postalCode: formatPostalCode(postalCode),
});

const EMPTY_ADDRESS: AddressFormInput = {
  street: '',
  number: '',
  complement: '',
  district: '',
  city: '',
  state: '',
  postalCode: '',
};

// Valores iniciais do formulário a partir dos dados atuais (com máscaras).
export const toOrganizationFormInput = ({
  address,
  cnpj,
  email,
  legalName,
  phone,
  tradeName,
}: Organization): OrganizationFormInput => ({
  legalName,
  tradeName,
  cnpj: formatCnpj(cnpj),
  phone: formatPhone(phone),
  email,
  address: toAddressInput(address),
});

export const toCongregationFormInput = (
  congregation: Congregation | null,
): CongregationFormInput => {
  if (!congregation) {
    return {
      code: '',
      name: '',
      cnpj: '',
      phone: '',
      email: '',
      address: EMPTY_ADDRESS,
    };
  }

  const { address, cnpj, code, email, name, phone } = congregation;

  return {
    code,
    name,
    cnpj: cnpj ? formatCnpj(cnpj) : '',
    phone: phone ? formatPhone(phone) : '',
    email: email ?? '',
    address: toAddressInput(address),
  };
};

export const toCongregationDetails = ({
  code: _code,
  ...details
}: CongregationFormData): CongregationDetails => details;

export const toCongregationRegistration = (data: CongregationFormData): CongregationRegistration =>
  data;

export const toOrganizationDetails = (data: OrganizationFormData): OrganizationDetails => data;

// Endereço em uma linha, ex.: Av. Roseira, 1684 - Parque Residencial dos Girassóis.
export const formatAddressLine = ({ complement, district, number, street }: PostalAddress) => {
  return `${street}, ${number}${complement ? ` (${complement})` : ''} - ${district}`;
};
