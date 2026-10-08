import { z } from 'zod';

export type GuestWifiStep = 'terms' | 'form' | 'success';

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

export const guestWifiFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, 'Informe seu nome completo.')
    .max(120, 'O nome deve ter no máximo 120 caracteres.')
    .refine((value) => value.split(/\s+/).length >= 2, 'Informe seu nome e sobrenome.'),
  phone: z
    .string()
    .min(1, 'Informe seu telefone.')
    .refine((value) => getPhoneDigits(value).length >= 10, 'Informe um telefone válido com DDD.'),
});

export type GuestWifiFormData = z.infer<typeof guestWifiFormSchema>;
