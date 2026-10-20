import { PhotoTransferError, type PhotoTransfer } from '@/features/gallery/domain/gallery';

// Envio direto do navegador ao bucket de mídia pela URL pré-assinada (ADR 0010 do backend). Usa
// XMLHttpRequest porque o fetch não informa o progresso do envio. Sem cookies: a URL já é a
// credencial, e o Content-Type precisa ser exatamente o assinado.
export const directPhotoTransfer: PhotoTransfer = {
  send: ({ contentType, uploadUrl }, file, onProgress) => {
    return new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open('PUT', uploadUrl);

      xhr.setRequestHeader('Content-Type', contentType);

      xhr.upload.addEventListener('progress', ({ lengthComputable, loaded, total }) => {
        if (lengthComputable && total > 0) {
          onProgress(loaded / total);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          onProgress(1);

          resolve();
        } else {
          reject(new PhotoTransferError(xhr.status));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new PhotoTransferError(0));
      });

      xhr.send(file);
    });
  },
};
