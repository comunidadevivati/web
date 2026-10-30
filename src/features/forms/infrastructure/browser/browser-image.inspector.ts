import type { ImageInspector } from '@/features/forms/domain/form';

// Decodifica a imagem no navegador só para ler largura e altura; arquivo inválido devolve null.
export const browserImageInspector: ImageInspector = {
  readDimensions: async (file) => {
    try {
      const bitmap = await createImageBitmap(file);

      const { height, width } = bitmap;

      bitmap.close();

      return { width, height };
    } catch {
      return null;
    }
  },
};
