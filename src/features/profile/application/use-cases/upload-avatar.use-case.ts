import type {
  AvatarContentType,
  AvatarTransfer,
  ProfileGateway,
} from '@/features/profile/domain/profile';
import { directAvatarTransfer } from '@/features/profile/infrastructure/http/direct-avatar.transfer';
import { profileHttpGateway } from '@/features/profile/infrastructure/http/profile-http.gateway';

// Pede a URL de envio, envia o arquivo direto ao bucket e confirma: a Core API valida e grava a
// foto. O tipo do arquivo já foi conferido pela tela.
export const uploadAvatarUseCase = async (
  csrfToken: string,
  file: File,
  gateway: ProfileGateway = profileHttpGateway,
  transfer: AvatarTransfer = directAvatarTransfer,
) => {
  const ticket = await gateway.requestAvatarUpload(csrfToken, file.type as AvatarContentType);

  await transfer.send(ticket, file);

  return gateway.completeAvatarUpload(csrfToken, ticket.uploadId);
};
