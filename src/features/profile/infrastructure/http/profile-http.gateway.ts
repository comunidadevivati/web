import {
  AccountSecurityError,
  AVATAR_CONTENT_TYPES,
  InvalidProfileDataError,
  ProfileAccessDeniedError,
  ProfileConflictError,
  ProfileServiceUnavailableError,
  SEXES,
  type ProfileGateway,
  type SecurityErrorCode,
} from '@/features/profile/domain/profile';
import { bffClient } from '@/shared/http/bff-client';
import { readProblemDetails } from '@/shared/http/problem-details';
import { isHTTPError } from 'ky';
import { z } from 'zod';

// Contratos de /api/v1/profile (repassado da Core API) e das rotas de segurança de /auth.
const nullableText = z.string().nullable();

const profileSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  sex: z.enum(SEXES).nullable(),
  birthDate: nullableText,
  phone: nullableText,
  secondaryPhone: nullableText,
  email: nullableText,
  secondaryEmail: nullableText,
  address: z
    .object({
      street: z.string(),
      number: z.string(),
      complement: nullableText,
      district: z.string(),
      city: z.string(),
      state: z.string(),
      postalCode: z.string(),
      country: z.string(),
      reference: nullableText,
    })
    .nullable(),
  socialLinks: z.object({
    instagram: nullableText,
    facebook: nullableText,
    linkedin: nullableText,
    twitter: nullableText,
    youtube: nullableText,
  }),
  avatarUrl: z.url().nullable(),
  version: z.number().int(),
});

const avatarUploadSchema = z.object({
  uploadId: z.string(),
  uploadUrl: z.url(),
  contentType: z.enum(AVATAR_CONTENT_TYPES),
});

const subscriptionsSchema = z.object({ news: z.boolean() });

const securityResultSchema = z.object({
  message: z.string().trim().min(1).max(300).optional(),
});

// Códigos estáveis do BFF nas recusas de segurança.
const SECURITY_CODES: Record<string, SecurityErrorCode> = {
  invalid_password: 'invalidPassword',
  weak_password: 'weakPassword',
  same_email: 'sameEmail',
  email_taken: 'emailTaken',
};

const securityErrorBodySchema = z.object({ code: z.string().optional() });

// Normaliza as falhas do BFF em erros do domínio. O 401 (sessão expirada) já é tratado pelo
// bffClient, que leva ao login; aqui ele vira apenas indisponibilidade.
const toProfileError = (error: unknown) => {
  if (!isHTTPError(error)) {
    return new ProfileServiceUnavailableError(error);
  }

  const { data, response } = error;

  switch (response.status) {
    case 400: {
      const { fields = [] } = readProblemDetails(data);

      return new InvalidProfileDataError(fields);
    }

    case 403:
      return new ProfileAccessDeniedError();

    case 409: {
      const { detail } = readProblemDetails(data);

      return new ProfileConflictError(detail);
    }

    default:
      return new ProfileServiceUnavailableError(error);
  }
};

const toSecurityError = (error: unknown, linkFlow = false) => {
  if (!isHTTPError(error)) {
    return new ProfileServiceUnavailableError(error);
  }

  const { data, response } = error;

  if (response.status === 429) {
    return new AccountSecurityError('tooManyAttempts');
  }

  const parsed = securityErrorBodySchema.safeParse(data);

  const code = parsed.success && parsed.data.code ? SECURITY_CODES[parsed.data.code] : undefined;

  if (code) {
    return new AccountSecurityError(code);
  }

  // Na confirmação pelo link, o 400 sem código é link inválido ou expirado.
  if (linkFlow && response.status === 400) {
    return new AccountSecurityError('invalidLink');
  }

  return new ProfileServiceUnavailableError(error);
};

const request = async <T>(
  schema: z.ZodType<T>,
  send: () => Promise<Response>,
  toError: (error: unknown) => Error = toProfileError,
) => {
  let body: unknown;

  try {
    body = await (await send()).json();
  } catch (error) {
    throw toError(error);
  }

  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    throw new ProfileServiceUnavailableError(parsed.error);
  }

  return parsed.data;
};

const csrfHeaders = (csrfToken: string) => ({
  'X-CSRF-Token': csrfToken,
});

export const profileHttpGateway: ProfileGateway = {
  getProfile: () => {
    return request(profileSchema, () => bffClient.get('api/v1/profile'));
  },

  updateProfile: (csrfToken, version, details) => {
    return request(profileSchema, () =>
      bffClient.put('api/v1/profile', {
        headers: csrfHeaders(csrfToken),
        json: { version, ...details },
        // Gravação: sem nova tentativa automática (a versão já teria mudado).
        retry: 0,
      }),
    );
  },

  requestAvatarUpload: (csrfToken, contentType) => {
    return request(avatarUploadSchema, () =>
      bffClient.post('api/v1/profile/avatar/uploads', {
        headers: csrfHeaders(csrfToken),
        json: { contentType },
      }),
    );
  },

  completeAvatarUpload: (csrfToken, uploadId) => {
    return request(profileSchema, () =>
      bffClient.put('api/v1/profile/avatar', {
        headers: csrfHeaders(csrfToken),
        json: { uploadId },
        retry: 0,
      }),
    );
  },

  removeAvatar: (csrfToken) => {
    return request(profileSchema, () =>
      bffClient.delete('api/v1/profile/avatar', { headers: csrfHeaders(csrfToken) }),
    );
  },

  getSubscriptions: () => {
    return request(subscriptionsSchema, () => bffClient.get('api/v1/profile/subscriptions'));
  },

  updateSubscriptions: (csrfToken, subscriptions) => {
    return request(subscriptionsSchema, () =>
      bffClient.put('api/v1/profile/subscriptions', {
        headers: csrfHeaders(csrfToken),
        json: subscriptions,
      }),
    );
  },

  changePassword: (csrfToken, currentPassword, newPassword) => {
    return request(
      securityResultSchema,
      () =>
        bffClient.post('auth/password', {
          headers: csrfHeaders(csrfToken),
          json: { currentPassword, newPassword },
        }),
      (error) => toSecurityError(error),
    );
  },

  requestEmailChange: (csrfToken, currentPassword, newEmail) => {
    return request(
      securityResultSchema,
      () =>
        bffClient.post('auth/email-change', {
          headers: csrfHeaders(csrfToken),
          json: { currentPassword, newEmail },
        }),
      (error) => toSecurityError(error),
    );
  },

  confirmEmailChange: (token) => {
    return request(
      securityResultSchema,
      () => bffClient.post('auth/email-change/confirm', { json: { token } }),
      (error) => toSecurityError(error, true),
    );
  },
};
