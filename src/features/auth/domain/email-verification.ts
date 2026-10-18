export interface EmailVerificationResult {
  message?: string;
}

export interface EmailVerificationGateway {
  // Confirma o e-mail a partir do token recebido no link.
  verifyEmail: (token: string) => Promise<EmailVerificationResult>;

  // Envia um novo link para o e-mail da sessão atual.
  resendEmailVerification: (csrfToken: string) => Promise<EmailVerificationResult>;
}

export class InvalidEmailVerificationTokenError extends Error {
  constructor() {
    super('Invalid or expired email verification token');

    this.name = 'InvalidEmailVerificationTokenError';
  }
}

export class EmailAlreadyVerifiedError extends Error {
  constructor() {
    super('Email already verified');

    this.name = 'EmailAlreadyVerifiedError';
  }
}
