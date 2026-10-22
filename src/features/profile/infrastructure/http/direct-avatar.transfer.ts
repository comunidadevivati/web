import { AvatarTransferError, type AvatarTransfer } from '@/features/profile/domain/profile';

// Envio direto do navegador ao bucket de mídia pela URL pré-assinada. Sem cookies: a URL já é a
// credencial, e o Content-Type precisa ser exatamente o assinado.
export const directAvatarTransfer: AvatarTransfer = {
  send: async ({ contentType, uploadUrl }, file) => {
    let response: Response;

    try {
      response = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': contentType },
        body: file,
        credentials: 'omit',
      });
    } catch {
      throw new AvatarTransferError(0);
    }

    if (!response.ok) {
      throw new AvatarTransferError(response.status);
    }
  },
};
