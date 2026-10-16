// Política de senha: regras puras, usadas na validação dos formulários e no medidor de força.

export const PASSWORD_MIN_LENGTH = 8;

export const PASSWORD_MAX_LENGTH = 64;

export type PasswordStrength = 'empty' | 'weak' | 'medium' | 'strong';

export type PasswordRequirement = 'minLength' | 'lowercase' | 'uppercase' | 'number' | 'symbol';

export type PasswordRequirementStatus = {
  requirement: PasswordRequirement;
  isMet: boolean;
};

// Trechos óbvios que tornam qualquer senha fraca, mesmo combinados com números e símbolos.
const COMMON_PASSWORD_TERMS = [
  'password',
  'senha',
  'qwerty',
  'asdf',
  'abc123',
  'admin',
  'welcome',
  'iloveyou',
  'teamo',
  'mudar',
  'comunidade',
  'viva',
  'eficaz',
  'igreja',
  'jesus',
  'deus',
];

const SEQUENCE_LENGTH = 4;

const requirementTests: Record<PasswordRequirement, (password: string) => boolean> = {
  minLength: (password) => password.length >= PASSWORD_MIN_LENGTH,
  lowercase: (password) => /\p{Ll}/u.test(password),
  uppercase: (password) => /\p{Lu}/u.test(password),
  number: (password) => /\d/.test(password),
  symbol: (password) => /[^\p{L}\d]/u.test(password),
};

const CHARACTER_CLASSES: PasswordRequirement[] = ['lowercase', 'uppercase', 'number', 'symbol'];

export const getPasswordRequirements = (password: string): PasswordRequirementStatus[] => {
  return (Object.keys(requirementTests) as PasswordRequirement[]).map((requirement) => ({
    requirement,
    isMet: requirementTests[requirement](password),
  }));
};

const normalize = (value: string) => {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase();
};

// Sequências como "1234", "abcd" ou "4321".
const hasSequence = (password: string) => {
  const value = normalize(password);

  for (let start = 0; start <= value.length - SEQUENCE_LENGTH; start += 1) {
    const codes = [...value.slice(start, start + SEQUENCE_LENGTH)].map((char) =>
      char.charCodeAt(0),
    );

    const steps = codes.slice(1).map((code, index) => code - codes[index]);

    if (steps.every((step) => step === 1) || steps.every((step) => step === -1)) {
      return true;
    }
  }

  return false;
};

// Mesmo caractere repetido 3 vezes ou mais (ex.: "aaa", "111").
const hasRepetition = (password: string) => {
  return /(.)\1{2,}/u.test(password);
};

const containsCommonTerm = (password: string) => {
  const value = normalize(password).replace(/[^a-z]/g, '');

  return COMMON_PASSWORD_TERMS.some((term) => value.includes(term));
};

// Partículas de nomes que não identificam a pessoa.
const NAME_PARTICLES = new Set(['das', 'dos', 'del', 'van', 'von']);

// Dados pessoais (nome, partes do e-mail) com 3+ caracteres não podem aparecer na senha.
const containsPersonalInfo = (password: string, personalInfo: string[]) => {
  const value = normalize(password);

  return personalInfo
    .map(normalize)
    .filter((info) => info.length >= 3 && !NAME_PARTICLES.has(info))
    .some((info) => value.includes(info));
};

export const hasEdgeWhitespace = (password: string) => {
  return password !== password.trim();
};

export const getPasswordStrength = (
  password: string,
  personalInfo: string[] = [],
): PasswordStrength => {
  if (password.length === 0) {
    return 'empty';
  }

  const characterClasses = CHARACTER_CLASSES.filter((requirement) =>
    requirementTests[requirement](password),
  ).length;

  if (
    password.length < PASSWORD_MIN_LENGTH ||
    password.length > PASSWORD_MAX_LENGTH ||
    characterClasses < 3 ||
    hasEdgeWhitespace(password) ||
    containsCommonTerm(password) ||
    containsPersonalInfo(password, personalInfo)
  ) {
    return 'weak';
  }

  const score =
    characterClasses +
    (password.length >= 12 ? 1 : 0) +
    (password.length >= 16 ? 1 : 0) -
    (hasSequence(password) ? 1 : 0) -
    (hasRepetition(password) ? 1 : 0);

  if (score < 3) {
    return 'weak';
  }

  return score >= 5 ? 'strong' : 'medium';
};

// Partes do nome e do usuário do e-mail (antes do @) que não devem aparecer na senha.
export const getPersonalInfoTerms = (fullName: string, email: string) => {
  const [emailUser = ''] = email.split('@');

  return [...fullName.split(/\s+/), ...emailUser.split(/[._+-]+/)].filter(Boolean);
};
