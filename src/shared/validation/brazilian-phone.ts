// Telefone brasileiro com DDD: fixo (10 dígitos) ou celular (11 dígitos, começando com 9).

// DDDs em uso no Brasil (Anatel).
const VALID_AREA_CODES = new Set([
  11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28, 31, 32, 33, 34, 35, 37, 38, 41, 42, 43,
  44, 45, 46, 47, 48, 49, 51, 53, 54, 55, 61, 62, 63, 64, 65, 66, 67, 68, 69, 71, 73, 74, 75, 77,
  79, 81, 82, 83, 84, 85, 86, 87, 88, 89, 91, 92, 93, 94, 95, 96, 97, 98, 99,
]);

export type BrazilianPhoneIssue = 'incomplete' | 'invalidAreaCode' | 'invalidNumber';

export const getPhoneDigits = (value: string) => {
  return value.replace(/\D/g, '').slice(0, 11);
};

// Máscara progressiva: (67) 3333-4444 ou (67) 99999-8888.
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

// Motivo pelo qual o telefone é inválido, ou null quando é válido.
export const getBrazilianPhoneIssue = (value: string): BrazilianPhoneIssue | null => {
  const digits = getPhoneDigits(value);

  if (digits.length < 10) {
    return 'incomplete';
  }

  if (!VALID_AREA_CODES.has(Number(digits.slice(0, 2)))) {
    return 'invalidAreaCode';
  }

  const number = digits.slice(2);

  // Celular: 9 + 8 dígitos. Fixo: começa com 2 a 5.
  const isMobile = number.length === 9 && number.startsWith('9');

  const isLandline = number.length === 8 && /^[2-5]/.test(number);

  if (!isMobile && !isLandline) {
    return 'invalidNumber';
  }

  // Números com todos os dígitos iguais (ex.: 99999-9999) não existem.
  if (/^(\d)\1+$/.test(number.slice(isMobile ? 1 : 0))) {
    return 'invalidNumber';
  }

  return null;
};
