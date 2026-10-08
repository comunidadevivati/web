import type { TranslationKey } from '@/app/i18n/translation-key';
import { z } from 'zod';

export type GuestWifiStep = 'terms' | 'form' | 'success';

// Tempo até levar o visitante para a home depois de liberar a internet.
export const GUEST_WIFI_REDIRECT_SECONDS = 3;

// O router converte valores numéricos da URL (ex.: radioId=0) em number.
const searchValueSchema = z
  .union([z.string(), z.number()])
  .transform(String)
  .optional()
  .catch(undefined);

export const guestWifiSearchSchema = z.object({
  clientMac: searchValueSchema,
  clientIp: searchValueSchema,
  apMac: searchValueSchema,
  ssidName: searchValueSchema,
  radioId: searchValueSchema,
  gatewayMac: searchValueSchema,
  vid: searchValueSchema,
  site: searchValueSchema,
  redirectUrl: searchValueSchema,
  t: searchValueSchema,
});

export type GuestWifiSearch = z.infer<typeof guestWifiSearchSchema>;

export const getPhoneDigits = (value: string) => {
  return value.replace(/\D/g, '').slice(0, 11);
};

// Máscara de telefone brasileiro: (67) 3333-4444 ou (67) 99999-8888.
export const formatPhone = (value: string) => {
  const digits = getPhoneDigits(value);

  if (digits.length <= 2) {
    return digits.length > 0 ? `(${digits}` : '';
  }

  const areaCode = digits.slice(0, 2);

  const number = digits.slice(2);

  const splitIndex = digits.length === 11 ? 5 : 4;

  if (number.length <= splitIndex) {
    return `(${areaCode}) ${number}`;
  }

  return `(${areaCode}) ${number.slice(0, splitIndex)}-${number.slice(splitIndex)}`;
};

// As mensagens de validação são chaves de tradução (namespace "guestWifi"), traduzidas na exibição.
const validationMessages = {
  fullNameRequired: 'form.validation.fullNameRequired',
  fullNameTooLong: 'form.validation.fullNameTooLong',
  fullNameIncomplete: 'form.validation.fullNameIncomplete',
  phoneRequired: 'form.validation.phoneRequired',
  phoneInvalid: 'form.validation.phoneInvalid',
} as const satisfies Record<string, TranslationKey<'guestWifi'>>;

export const guestWifiFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, validationMessages.fullNameRequired)
    .max(120, validationMessages.fullNameTooLong)
    .refine((value) => value.split(/\s+/).length >= 2, validationMessages.fullNameIncomplete),
  phone: z
    .string()
    .min(1, validationMessages.phoneRequired)
    .refine((value) => getPhoneDigits(value).length >= 10, validationMessages.phoneInvalid),
});

export type GuestWifiFormData = z.infer<typeof guestWifiFormSchema>;
