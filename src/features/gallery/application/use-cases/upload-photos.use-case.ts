import {
  GalleryConflictError,
  MAX_PHOTO_BYTES,
  MAX_UPLOADS_PER_REQUEST,
  PhotoTransferError,
  isAcceptedPhotoType,
  type GalleryGateway,
  type PhotoTransfer,
  type UploadTicket,
} from '@/features/gallery/domain/gallery';
import { directPhotoTransfer } from '@/features/gallery/infrastructure/http/direct-photo.transfer';
import { galleryHttpGateway } from '@/features/gallery/infrastructure/http/gallery-http.gateway';

// Envios simultâneos ao bucket: suficiente para aproveitar a banda sem travar o navegador.
const PARALLEL_TRANSFERS = 3;

export type UploadStage = 'waiting' | 'sending' | 'confirming' | 'done' | 'failed';

export type UploadFailure = 'invalidType' | 'tooLarge' | 'rejected' | 'transfer' | 'unavailable';

export type UploadUpdate = {
  stage: UploadStage;
  // Fração enviada, de 0 a 1.
  progress: number;
  failure?: UploadFailure;
  // Explicação do servidor para uma recusa (ex.: álbum cheio), quando houver.
  detail?: string;
};

type UploadPhotosCommand = {
  csrfToken: string;
  albumId: string;
  files: readonly File[];
  // Chamado a cada mudança de um arquivo, pelo índice em files.
  onUpdate: (index: number, update: UploadUpdate) => void;
};

export type UploadSummary = {
  sent: number;
  failed: number;
};

const failureOf = (error: unknown): Pick<UploadUpdate, 'failure' | 'detail'> => {
  if (error instanceof GalleryConflictError) {
    return { failure: 'rejected', detail: error.detail };
  }

  return { failure: error instanceof PhotoTransferError ? 'transfer' : 'unavailable' };
};

// Executa as tarefas com no máximo `limit` ao mesmo tempo, na ordem.
const runPool = async (tasks: (() => Promise<void>)[], limit: number) => {
  let next = 0;

  const worker = async () => {
    while (next < tasks.length) {
      const task = tasks[next];

      next += 1;

      // oxlint-disable-next-line no-await-in-loop -- cada worker envia um arquivo por vez
      await task?.();
    }
  };

  await Promise.all(Array.from({ length: Math.min(limit, tasks.length) }, worker));
};

// Envio de fotos ao álbum (ADR 0010 do backend): confere tipo e tamanho, pede as URLs ao BFF em
// lotes de até 50, envia cada arquivo direto ao bucket de mídia e confirma o envio. A falha de um
// arquivo não interrompe os demais; o processamento das fotos continua no servidor.
export const uploadPhotosUseCase = async (
  { albumId, csrfToken, files, onUpdate }: UploadPhotosCommand,
  gateway: GalleryGateway = galleryHttpGateway,
  transfer: PhotoTransfer = directPhotoTransfer,
): Promise<UploadSummary> => {
  const summary: UploadSummary = { sent: 0, failed: 0 };

  const fail = (index: number, update: Pick<UploadUpdate, 'failure' | 'detail'>) => {
    summary.failed += 1;

    onUpdate(index, { stage: 'failed', progress: 0, ...update });
  };

  const valid: number[] = [];

  files.forEach(({ size, type }, index) => {
    if (!isAcceptedPhotoType(type)) {
      fail(index, { failure: 'invalidType' });
    } else if (size > MAX_PHOTO_BYTES) {
      fail(index, { failure: 'tooLarge' });
    } else {
      valid.push(index);

      onUpdate(index, { stage: 'waiting', progress: 0 });
    }
  });

  const transferOne = async (index: number, ticket: UploadTicket) => {
    const file = files[index];

    if (!file) {
      return;
    }

    try {
      onUpdate(index, { stage: 'sending', progress: 0 });

      await transfer.send(ticket, file, (progress) => {
        onUpdate(index, { stage: 'sending', progress });
      });

      onUpdate(index, { stage: 'confirming', progress: 1 });

      await gateway.completeUpload(csrfToken, ticket.photoId);

      summary.sent += 1;

      onUpdate(index, { stage: 'done', progress: 1 });
    } catch (error) {
      fail(index, failureOf(error));
    }
  };

  for (let start = 0; start < valid.length; start += MAX_UPLOADS_PER_REQUEST) {
    const batch = valid.slice(start, start + MAX_UPLOADS_PER_REQUEST);

    let tickets: UploadTicket[];

    try {
      // oxlint-disable-next-line no-await-in-loop -- lotes sucessivos, respeitando o limite do BFF
      tickets = await gateway.requestUploads(
        csrfToken,
        albumId,
        batch.map((index) => ({
          contentType: files[index]?.type ?? '',
          byteSize: files[index]?.size ?? 0,
        })),
      );
    } catch (error) {
      for (const index of batch) {
        fail(index, failureOf(error));
      }

      continue;
    }

    // oxlint-disable-next-line no-await-in-loop -- um lote termina antes do próximo começar
    await runPool(
      batch.map((index, position) => () => {
        const ticket = tickets[position];

        return ticket ? transferOne(index, ticket) : Promise.resolve();
      }),
      PARALLEL_TRANSFERS,
    );
  }

  return summary;
};
