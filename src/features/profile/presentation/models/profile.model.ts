import type { TranslationKey } from '@/app/i18n/translation-key';
import {
  AccountSecurityError,
  AVATAR_CONTENT_TYPES,
  AVATAR_MAX_BYTES,
  InvalidProfileDataError,
  ProfileAccessDeniedError,
  ProfileConflictError,
  SOCIAL_NETWORKS,
  type HomeAddress,
  type Profile,
  type ProfileDetails,
  type SecurityErrorCode,
  type SocialNetwork,
} from '@/features/profile/domain/profile';
import {
  formatPostalCode,
  getPostalCodeDigits,
  isBrazilianState,
  isValidPostalCode,
} from '@/shared/validation/brazilian-address';
import {
  formatPhone,
  getBrazilianPhoneIssue,
  getPhoneDigits,
} from '@/shared/validation/brazilian-phone';
import {
  getPasswordStrength,
  hasEdgeWhitespace,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from '@/shared/validation/password-strength';
import { z } from 'zod';

// Limites da Core API.
export const FULL_NAME_MAX_LENGTH = 120;

export const STREET_MAX_LENGTH = 200;

export const ADDRESS_NUMBER_MAX_LENGTH = 20;

export const ADDRESS_TEXT_MAX_LENGTH = 100;

export const COUNTRY_MAX_LENGTH = 60;

export const REFERENCE_MAX_LENGTH = 200;

export const EMAIL_MAX_LENGTH = 254;

export const SOCIAL_LINK_MAX_LENGTH = 300;

export const DEFAULT_COUNTRY = 'Brasil';

// Falhas das requests do Perfil, exibidas em toast.
export type ProfileNotice = 'invalidData' | 'conflict' | 'accessDenied' | 'unavailable';

export const getProfileNotice = (error: Error): ProfileNotice => {
  if (error instanceof InvalidProfileDataError) {
    return 'invalidData';
  }

  if (error instanceof ProfileConflictError) {
    return 'conflict';
  }

  if (error instanceof ProfileAccessDeniedError) {
    return 'accessDenied';
  }

  return 'unavailable';
};

export const getSecurityNotice = (error: Error): SecurityErrorCode | 'unavailable' => {
  return error instanceof AccountSecurityError ? error.code : 'unavailable';
};

// Mensagens de validação: chaves de tradução do namespace "profile".
export const profileValidationMessages = {
  required: 'validation.required',
  tooLong: 'validation.tooLong',
  invalid: 'validation.invalid',
  fullNameInvalid: 'validation.fullNameInvalid',
  birthDateInvalid: 'validation.birthDateInvalid',
  emailInvalid: 'validation.emailInvalid',
  postalCodeInvalid: 'validation.postalCodeInvalid',
  stateInvalid: 'validation.stateInvalid',
  socialLinkInvalid: 'validation.socialLinkInvalid',
  phoneIncomplete: 'validation.phoneIncomplete',
  phoneInvalidAreaCode: 'validation.phoneInvalidAreaCode',
  phoneInvalidNumber: 'validation.phoneInvalidNumber',
  passwordRequired: 'validation.passwordRequired',
  passwordTooShort: 'validation.passwordTooShort',
  passwordTooLong: 'validation.passwordTooLong',
  passwordEdgeWhitespace: 'validation.passwordEdgeWhitespace',
  passwordWeak: 'validation.passwordWeak',
  passwordMismatch: 'validation.passwordMismatch',
  passwordSameAsCurrent: 'validation.passwordSameAsCurrent',
} as const satisfies Record<string, TranslationKey<'profile'>>;

const messages = profileValidationMessages;

const phoneIssueMessages = {
  incomplete: messages.phoneIncomplete,
  invalidAreaCode: messages.phoneInvalidAreaCode,
  invalidNumber: messages.phoneInvalidNumber,
} as const;

const NAME_PATTERN = /^[\p{L}\p{M}' .-]+$/u;

const isBlank = (value: string) => value.trim() === '';

// Campo opcional: vazio vira null; preenchido, segue a regra do campo.
const optional = <T extends z.ZodType<string, string>>(schema: T) => {
  return z
    .string()
    .trim()
    .transform((value) => (value === '' ? null : value))
    .pipe(schema.nullable());
};

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

// Data de hoje (AAAA-MM-DD) no fuso do navegador.
export const getTodayIso = () => {
  const now = new Date();

  return [now.getFullYear(), now.getMonth() + 1, now.getDate()]
    .map((part) => String(part).padStart(2, '0'))
    .join('-');
};

const birthDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, messages.birthDateInvalid)
  .refine((value) => value >= '1900-01-01' && value <= getTodayIso(), messages.birthDateInvalid);

// Domínios aceitos em cada rede, como na Core API.
const SOCIAL_HOSTS: Record<SocialNetwork, string[]> = {
  instagram: ['instagram.com'],
  facebook: ['facebook.com', 'fb.com'],
  linkedin: ['linkedin.com'],
  twitter: ['twitter.com', 'x.com'],
  youtube: ['youtube.com', 'youtu.be'],
};

const isSocialLink = (network: SocialNetwork, value: string) => {
  try {
    const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);

    const host = url.hostname.toLowerCase();

    return (
      SOCIAL_HOSTS[network].some((domain) => host === domain || host.endsWith(`.${domain}`)) &&
      url.pathname.length > 1
    );
  } catch {
    return false;
  }
};

const socialLinkSchema = (network: SocialNetwork) => {
  return optional(
    z
      .string()
      .max(SOCIAL_LINK_MAX_LENGTH, messages.tooLong)
      .refine((value) => isSocialLink(network, value), messages.socialLinkInvalid),
  );
};

const isBrazil = (country: string) => {
  const normalized = country
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim()
    .toLowerCase();

  return normalized === '' || normalized === 'brasil' || normalized === 'brazil';
};

const addressInputSchema = z.object({
  postalCode: z.string(),
  street: z.string(),
  number: z.string(),
  complement: z.string(),
  district: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  reference: z.string(),
});

type AddressInput = z.input<typeof addressInputSchema>;

// O país sozinho (já preenchido com Brasil) não conta como endereço informado.
const isEmptyAddress = ({ country: _country, ...address }: AddressInput) => {
  return Object.values(address).every(isBlank);
};

const ADDRESS_LIMITS: [keyof AddressInput, number, boolean][] = [
  ['street', STREET_MAX_LENGTH, true],
  ['number', ADDRESS_NUMBER_MAX_LENGTH, true],
  ['complement', ADDRESS_TEXT_MAX_LENGTH, false],
  ['district', ADDRESS_TEXT_MAX_LENGTH, true],
  ['city', ADDRESS_TEXT_MAX_LENGTH, true],
  ['reference', REFERENCE_MAX_LENGTH, false],
  ['country', COUNTRY_MAX_LENGTH, false],
];

// Endereço opcional; quando informado, todos os campos são obrigatórios, exceto complemento e ponto
// de referência. No Brasil, CEP com 8 dígitos e UF válida.
const addressSchema = addressInputSchema
  .superRefine((address, context) => {
    if (isEmptyAddress(address)) {
      return;
    }

    const issue = (path: keyof AddressInput, message: string) => {
      context.addIssue({ code: 'custom', path: [path], message });
    };

    for (const [field, max, required] of ADDRESS_LIMITS) {
      const value = address[field].trim();

      if (required && value === '') {
        issue(field, messages.required);
      } else if (value.length > max) {
        issue(field, messages.tooLong);
      }
    }

    if (isBrazil(address.country)) {
      if (!isBrazilianState(address.state)) {
        issue('state', messages.stateInvalid);
      }

      if (!isValidPostalCode(address.postalCode)) {
        issue('postalCode', messages.postalCodeInvalid);
      }
    } else {
      if (isBlank(address.state)) {
        issue('state', messages.required);
      }

      if (isBlank(address.postalCode)) {
        issue('postalCode', messages.required);
      }
    }
  })
  .transform((address): HomeAddress | null => {
    if (isEmptyAddress(address)) {
      return null;
    }

    const brazil = isBrazil(address.country);

    return {
      street: address.street.trim(),
      number: address.number.trim(),
      complement: address.complement.trim() || null,
      district: address.district.trim(),
      city: address.city.trim(),
      state: brazil ? address.state.trim().toUpperCase() : address.state.trim(),
      postalCode: brazil ? getPostalCodeDigits(address.postalCode) : address.postalCode.trim(),
      country: brazil ? DEFAULT_COUNTRY : address.country.trim(),
      reference: address.reference.trim() || null,
    };
  });

export const profileFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, messages.required)
    .max(FULL_NAME_MAX_LENGTH, messages.tooLong)
    .regex(NAME_PATTERN, messages.fullNameInvalid),
  sex: z.enum(['', 'MALE', 'FEMALE']).transform((value) => value || null),
  birthDate: optional(birthDateSchema),
  phone: optional(phoneSchema),
  secondaryPhone: optional(phoneSchema),
  secondaryEmail: optional(emailSchema),
  address: addressSchema,
  socialLinks: z.object(
    Object.fromEntries(
      SOCIAL_NETWORKS.map((network) => [network, socialLinkSchema(network)]),
    ) as Record<SocialNetwork, ReturnType<typeof socialLinkSchema>>,
  ),
});

export type ProfileFormInput = z.input<typeof profileFormSchema>;

export type ProfileFormData = z.output<typeof profileFormSchema>;

export type AddressField = keyof ProfileFormInput['address'];

export const ADDRESS_FIELDS: AddressField[] = [
  'postalCode',
  'street',
  'number',
  'complement',
  'district',
  'city',
  'state',
  'country',
  'reference',
];

// Valores iniciais do formulário a partir do cadastro (com máscaras).
export const toProfileFormInput = ({
  address,
  birthDate,
  fullName,
  phone,
  secondaryEmail,
  secondaryPhone,
  sex,
  socialLinks,
}: Profile): ProfileFormInput => ({
  fullName,
  sex: sex ?? '',
  birthDate: birthDate ?? '',
  phone: phone ? formatPhone(phone) : '',
  secondaryPhone: secondaryPhone ? formatPhone(secondaryPhone) : '',
  secondaryEmail: secondaryEmail ?? '',
  address: {
    postalCode: address
      ? isBrazil(address.country)
        ? formatPostalCode(address.postalCode)
        : address.postalCode
      : '',
    street: address?.street ?? '',
    number: address?.number ?? '',
    complement: address?.complement ?? '',
    district: address?.district ?? '',
    city: address?.city ?? '',
    state: address?.state ?? '',
    country: address?.country ?? DEFAULT_COUNTRY,
    reference: address?.reference ?? '',
  },
  socialLinks: {
    instagram: socialLinks.instagram ?? '',
    facebook: socialLinks.facebook ?? '',
    linkedin: socialLinks.linkedin ?? '',
    twitter: socialLinks.twitter ?? '',
    youtube: socialLinks.youtube ?? '',
  },
});

export const toProfileDetails = (data: ProfileFormData): ProfileDetails => ({ ...data });

// Formata o CEP só quando o país é o Brasil (em outro país, o código postal é livre).
export const formatPostalCodeFor = (country: string, value: string) => {
  return isBrazil(country) ? formatPostalCode(value) : value;
};

export type AvatarFileIssue = 'avatarType' | 'avatarSize';

export const getAvatarFileIssue = (file: File): AvatarFileIssue | null => {
  if (!(AVATAR_CONTENT_TYPES as readonly string[]).includes(file.type)) {
    return 'avatarType';
  }

  return file.size > AVATAR_MAX_BYTES ? 'avatarSize' : null;
};

const newPasswordSchema = z
  .string()
  .min(1, messages.passwordRequired)
  .min(PASSWORD_MIN_LENGTH, messages.passwordTooShort)
  .max(PASSWORD_MAX_LENGTH, messages.passwordTooLong)
  .refine((password) => !hasEdgeWhitespace(password), messages.passwordEdgeWhitespace);

// personalInfo: partes do nome e do e-mail, que não podem aparecer na nova senha.
export const createChangePasswordSchema = (personalInfo: string[]) => {
  return z
    .object({
      currentPassword: z.string().min(1, messages.passwordRequired),
      newPassword: newPasswordSchema,
      confirmPassword: z.string().min(1, messages.passwordRequired),
    })
    .refine(({ newPassword }) => getPasswordStrength(newPassword, personalInfo) !== 'weak', {
      message: messages.passwordWeak,
      path: ['newPassword'],
      when: () => true,
    })
    .refine(({ currentPassword, newPassword }) => newPassword !== currentPassword, {
      message: messages.passwordSameAsCurrent,
      path: ['newPassword'],
      when: () => true,
    })
    .refine(({ confirmPassword, newPassword }) => confirmPassword === newPassword, {
      message: messages.passwordMismatch,
      path: ['confirmPassword'],
      when: () => true,
    });
};

export type ChangePasswordFormData = z.infer<ReturnType<typeof createChangePasswordSchema>>;

export const changeEmailFormSchema = z.object({
  newEmail: emailSchema,
  currentPassword: z.string().min(1, messages.passwordRequired),
});

export type ChangeEmailFormData = z.infer<typeof changeEmailFormSchema>;

const EMAIL_CHANGE_TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/u;

export const confirmEmailChangeSearchSchema = z
  .object({
    token: z.string().optional(),
  })
  .transform(({ token }) => ({
    token: token && EMAIL_CHANGE_TOKEN_PATTERN.test(token) ? token : undefined,
  }));
