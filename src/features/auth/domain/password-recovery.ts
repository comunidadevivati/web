// Retorno de uma solicitação aceita: a mensagem do BFF, exibida no lugar do texto padrão.
export type PasswordRecoveryResult = {
  message?: string;
};

export type PasswordReset = {
  password: string;
  token: string;
};

export interface PasswordRecoveryGateway {
  // Pede ao servidor o envio, para o e-mail informado, de um link de troca de senha.
  requestPasswordReset: (email: string) => Promise<PasswordRecoveryResult>;

  resetPassword: (passwordReset: PasswordReset) => Promise<PasswordRecoveryResult>;
}

export class InvalidPasswordResetTokenError extends Error {
  constructor() {
    super('Invalid or expired password reset token');

    this.name = 'InvalidPasswordResetTokenError';
  }
}

export class WeakPasswordResetError extends Error {
  constructor() {
    super('Password does not meet security requirements');

    this.name = 'WeakPasswordResetError';
  }
}
