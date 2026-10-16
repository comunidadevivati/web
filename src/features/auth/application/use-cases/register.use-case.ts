import type { Registration, RegistrationGateway } from '@/features/auth/domain/registration';
import { registrationHttpGateway } from '@/features/auth/infrastructure/http/registration-http.gateway';

export const registerUseCase = (
  registration: Registration,
  gateway: RegistrationGateway = registrationHttpGateway,
) => {
  return gateway.register(registration);
};
