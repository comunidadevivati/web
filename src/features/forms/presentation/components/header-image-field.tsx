import { Box, Button, Dropzone, Image, Label, Text } from '@/components/ui';
import { HEADER_IMAGE_ACCEPT } from '@/features/forms/presentation/models/forms.model';
import { Trash2Icon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const INPUT_ID = 'form-header-image';

type HeaderImageFieldProps = {
  // Imagem exibida agora (escolhida ou já salva); null quando não há.
  preview: { url: string; width: number; height: number; details: string } | null;
  // Motivo da recusa da última imagem escolhida, já traduzido.
  error?: string;
  isInspecting: boolean;
  disabled: boolean;
  onSelect: (file: File) => void;
  onRemove: () => void;
};

// Imagem opcional exibida acima do título do formulário. A prévia fica dentro do próprio dropzone
// (cabe em até 800 x 600 px, mantendo a proporção e sem ampliar imagens menores): soltar ou clicar
// nela troca a imagem. Abaixo, os dados do arquivo e a remoção.
// As regras de tipo e tamanho ficam no domínio.
export const HeaderImageField = ({
  disabled,
  error,
  isInspecting,
  onRemove,
  onSelect,
  preview,
}: HeaderImageFieldProps) => {
  const { t } = useTranslation('forms');

  const describedBy = error ? `${INPUT_ID}-hint ${INPUT_ID}-error` : `${INPUT_ID}-hint`;

  return (
    <Box className="grid gap-3">
      <Label htmlFor={INPUT_ID} id={`${INPUT_ID}-label`}>
        {t('headerImage.label')}
      </Label>

      <Dropzone
        id={INPUT_ID}
        accept={HEADER_IMAGE_ACCEPT}
        aria-describedby={describedBy}
        aria-labelledby={`${INPUT_ID}-label`}
        busy={isInspecting}
        className="max-w-200"
        disabled={disabled}
        dragText={t('headerImage.dropzone.drag')}
        hoverText={t('headerImage.dropzone.hover')}
        idleText={t('headerImage.dropzone.idle')}
        invalid={Boolean(error)}
        preview={
          preview ? (
            <Image
              alt={t('headerImage.previewAlt')}
              className="mx-auto block h-auto max-h-150 w-auto max-w-full rounded-md"
              height={preview.height}
              src={preview.url}
              width={preview.width}
            />
          ) : undefined
        }
        onFileSelect={onSelect}
      />

      {preview && (
        <Box className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <Text className="text-xs text-muted-foreground">{preview.details}</Text>

          <Button
            className="h-10 px-4"
            disabled={disabled || isInspecting}
            type="button"
            variant="destructive"
            onClick={onRemove}
          >
            <Trash2Icon data-icon="inline-start" />
            {t('headerImage.remove')}
          </Button>
        </Box>
      )}

      <Text className="text-xs text-muted-foreground" id={`${INPUT_ID}-hint`}>
        {preview ? t('headerImage.replaceHint') : t('headerImage.hint')}
      </Text>

      {error && (
        <Text className="text-sm text-destructive-strong" id={`${INPUT_ID}-error`} role="alert">
          {error}
        </Text>
      )}
    </Box>
  );
};
