import {
  checkHeaderImage,
  type HeaderImageIssue,
  type ImageInspector,
} from '@/features/forms/domain/form';
import { browserImageInspector } from '@/features/forms/infrastructure/browser/browser-image.inspector';

export type HeaderImageInspection =
  | { accepted: true; width: number; height: number }
  | { accepted: false; issue: HeaderImageIssue };

// Valida tipo e tamanho da imagem do cabeçalho (antes de decodificar, para não ler arquivos grandes à
// toa) e confirma que ela abre como imagem; as dimensões lidas servem só para a exibição.
export const inspectHeaderImageUseCase = async (
  file: File,
  inspector: ImageInspector = browserImageInspector,
): Promise<HeaderImageInspection> => {
  const candidate = {
    name: file.name,
    contentType: file.type,
    byteSize: file.size,
  };

  const earlyIssue = checkHeaderImage({ ...candidate, width: 0, height: 0 });

  if (earlyIssue) {
    return { accepted: false, issue: earlyIssue };
  }

  const dimensions = await inspector.readDimensions(file);

  const issue = checkHeaderImage({
    ...candidate,
    width: dimensions?.width ?? null,
    height: dimensions?.height ?? null,
  });

  if (issue || !dimensions) {
    return { accepted: false, issue: issue ?? 'unreadable' };
  }

  return { accepted: true, ...dimensions };
};
