// Dados de um novo cadastro, já normalizados (nome sem espaços extras, telefone só com dígitos,
// e-mail em minúsculas). A senha vai direto ao BFF e nunca é guardada no front.
export type Registration = {
  fullName: string;
  phone: string;
  email: string;
  password: string;
};

// Já existe uma conta com o e-mail informado (HTTP 409).
export class EmailAlreadyRegisteredError extends Error {
  constructor() {
    super('Email already registered');

    this.name = 'EmailAlreadyRegisteredError';
  }
}

// O BFF recusou os dados enviados (HTTP 400).
export class InvalidRegistrationError extends Error {
  constructor(cause?: unknown) {
    super('Invalid registration data', { cause });

    this.name = 'InvalidRegistrationError';
  }
}

export interface RegistrationGateway {
  register: (registration: Registration) => Promise<void>;
}
