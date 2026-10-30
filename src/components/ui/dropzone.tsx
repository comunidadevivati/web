import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { ImageUpIcon, UploadIcon } from 'lucide-react';
import { useRef, useState, type DragEvent, type KeyboardEvent, type ReactNode } from 'react';

type DropzoneProps = {
  // id do input de arquivo (associa um Label externo via htmlFor).
  id: string;
  accept: string;
  // Textos já traduzidos: padrão, com o mouse ou o foco em cima e com um arquivo sendo arrastado.
  idleText: ReactNode;
  hoverText: ReactNode;
  dragText: ReactNode;
  // Nome acessível da área (ex.: o rótulo do campo).
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  invalid?: boolean;
  disabled?: boolean;
  // Arquivo em análise: mostra o carregamento e não aceita outro.
  busy?: boolean;
  className?: string;
  // Arquivo já escolhido (ex.: a imagem): ocupa a área, e os textos de troca aparecem por cima dele
  // com o mouse, o foco ou durante o arrasto.
  preview?: ReactNode;
  onFileSelect: (file: File) => void;
};

// Área para soltar um arquivo ou clicar (Enter/Espaço no teclado) e escolher pelo seletor do sistema.
// Entrega só o primeiro arquivo; as regras de tipo e tamanho ficam com quem usa.
export const Dropzone = ({
  accept,
  'aria-describedby': ariaDescribedBy,
  'aria-labelledby': ariaLabelledBy,
  busy = false,
  className,
  disabled = false,
  dragText,
  hoverText,
  id,
  idleText,
  invalid = false,
  onFileSelect,
  preview,
}: DropzoneProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // dragenter/dragleave disparam também nos filhos: o contador evita piscar ao passar por eles.
  const dragDepth = useRef(0);

  const [isDragging, setIsDragging] = useState(false);

  const isBlocked = disabled || busy;

  const openPicker = () => {
    if (!isBlocked) {
      inputRef.current?.click();
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();

      openPicker();
    }
  };

  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (isBlocked) {
      return;
    }

    dragDepth.current += 1;

    setIsDragging(true);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    event.dataTransfer.dropEffect = isBlocked ? 'none' : 'copy';
  };

  const handleDragLeave = () => {
    dragDepth.current = Math.max(0, dragDepth.current - 1);

    if (dragDepth.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    dragDepth.current = 0;

    setIsDragging(false);

    const file = event.dataTransfer.files[0];

    if (file && !isBlocked) {
      onFileSelect(file);
    }
  };

  const hasPreview = preview !== undefined && preview !== null;

  // Com arquivo escolhido, a camada sobre ele só aparece com o mouse/foco (se aceitar outro arquivo),
  // durante o arrasto ou o carregamento.
  const overlayVisible = isDragging || busy;

  return (
    <div
      aria-busy={busy}
      aria-describedby={ariaDescribedBy}
      aria-disabled={isBlocked}
      aria-invalid={invalid}
      aria-labelledby={ariaLabelledBy}
      className={cn(
        `
          group relative flex min-h-36 w-full cursor-pointer flex-col items-center justify-center
          gap-2 overflow-hidden rounded-lg border-2 border-dashed border-input-border/60 bg-muted/40
          text-center text-muted-foreground transition-colors duration-200 hover:border-input-border
          hover:bg-primary/5
        `,
        hasPreview ? 'p-2' : 'p-6',
        isDragging && 'border-input-border bg-primary/10 text-foreground',
        invalid && 'border-destructive-strong',
        isBlocked && 'cursor-not-allowed hover:border-input-border/60 hover:bg-muted/40',
        isBlocked && !hasPreview && 'opacity-60',
        className,
      )}
      data-dragging={isDragging || undefined}
      data-slot="dropzone"
      role="button"
      tabIndex={isBlocked ? -1 : 0}
      onClick={openPicker}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onKeyDown={handleKeyDown}
    >
      {hasPreview && (
        <>
          {preview}

          <div
            className={cn(
              `
                absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/85
                p-6 opacity-0 transition-opacity duration-200
              `,
              !isBlocked && 'group-hover:opacity-100 group-focus-visible:opacity-100',
              overlayVisible && 'opacity-100',
            )}
          >
            {busy && <Spinner className="size-7 text-primary-strong" />}

            {!busy && (
              <>
                {isDragging ? (
                  <UploadIcon aria-hidden="true" className="size-7 text-primary-strong" />
                ) : (
                  <ImageUpIcon aria-hidden="true" className="size-7 text-primary-strong" />
                )}

                <p className="text-sm font-semibold text-foreground">
                  {isDragging ? dragText : hoverText}
                </p>
              </>
            )}
          </div>
        </>
      )}

      {!hasPreview && busy && <Spinner className="size-7 text-primary-strong" />}

      {!hasPreview && !busy && isDragging && (
        <>
          <UploadIcon aria-hidden="true" className="size-7 text-primary-strong" />

          <p className="text-sm font-semibold text-foreground">{dragText}</p>
        </>
      )}

      {!hasPreview && !busy && !isDragging && (
        <>
          <ImageUpIcon
            aria-hidden="true"
            className="
              size-7 transition-colors group-hover:text-primary-strong
              group-focus-visible:text-primary-strong
            "
          />

          <p
            className={cn('text-sm', !isBlocked && 'group-hover:hidden group-focus-visible:hidden')}
          >
            {idleText}
          </p>

          {!isBlocked && (
            <p
              className="
                hidden text-sm font-semibold text-foreground group-hover:block
                group-focus-visible:block
              "
            >
              {hoverText}
            </p>
          )}
        </>
      )}

      <input
        ref={inputRef}
        accept={accept}
        className="sr-only"
        disabled={isBlocked}
        id={id}
        tabIndex={-1}
        type="file"
        onChange={(event) => {
          const file = event.target.files?.[0];

          // Limpa o seletor para permitir escolher o mesmo arquivo de novo.
          event.target.value = '';

          if (file) {
            onFileSelect(file);
          }
        }}
        onClick={(event) => event.stopPropagation()}
      />
    </div>
  );
};
