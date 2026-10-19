// Documentos e endereço brasileiros: CNPJ, CEP e UF. Mesmas regras da Core API.

export const BRAZILIAN_STATES = [
  'AC',
  'AL',
  'AM',
  'AP',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MG',
  'MS',
  'MT',
  'PA',
  'PB',
  'PE',
  'PI',
  'PR',
  'RJ',
  'RN',
  'RO',
  'RR',
  'RS',
  'SC',
  'SE',
  'SP',
  'TO',
] as const;

const FIRST_CNPJ_WEIGHTS = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

const SECOND_CNPJ_WEIGHTS = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

export const getCnpjDigits = (value: string) => {
  return value.replace(/\D/g, '').slice(0, 14);
};

// Máscara progressiva: 14.158.325/0001-01.
export const formatCnpj = (value: string) => {
  const digits = getCnpjDigits(value);

  const parts = [
    digits.slice(0, 2),
    digits.slice(2, 5),
    digits.slice(5, 8),
    digits.slice(8, 12),
    digits.slice(12, 14),
  ];

  const separators = ['', '.', '.', '/', '-'];

  return parts.map((part, index) => (part ? `${separators[index]}${part}` : '')).join('');
};

const getCnpjCheckDigit = (digits: number[], weights: number[]) => {
  const remainder =
    weights.reduce((sum, weight, index) => sum + weight * (digits[index] ?? 0), 0) % 11;

  return remainder < 2 ? 0 : 11 - remainder;
};

// 14 dígitos, não repetidos, com os dois dígitos verificadores corretos.
export const isValidCnpj = (value: string) => {
  const digits = getCnpjDigits(value);

  if (digits.length !== 14 || /^(\d)\1+$/.test(digits)) {
    return false;
  }

  const numbers = [...digits].map(Number);

  return (
    getCnpjCheckDigit(numbers, FIRST_CNPJ_WEIGHTS) === numbers[12] &&
    getCnpjCheckDigit(numbers, SECOND_CNPJ_WEIGHTS) === numbers[13]
  );
};

export const getPostalCodeDigits = (value: string) => {
  return value.replace(/\D/g, '').slice(0, 8);
};

// Máscara progressiva: 79091-848.
export const formatPostalCode = (value: string) => {
  const digits = getPostalCodeDigits(value);

  return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
};

export const isValidPostalCode = (value: string) => {
  return getPostalCodeDigits(value).length === 8;
};

export const isBrazilianState = (value: string) => {
  return (BRAZILIAN_STATES as readonly string[]).includes(value.trim().toUpperCase());
};
