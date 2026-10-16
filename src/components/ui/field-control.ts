import { cn } from 'cn';

/*
 * Aparência única de TODOS os campos de formulário (input, grupo com botão, select, textarea...).
 * Cores, borda, fundo, raio, altura, tipografia e estados vêm dos tokens semânticos:
 * - fundo: input-background; borda: input-border; texto: foreground; placeholder: placeholder;
 * - foco: contorno global de foco (src/index.css); a borda mantém sempre a mesma cor;
 * - inválido (aria-invalid): borda e anel destructive;
 * - desabilitado: fundo input, opacidade reduzida e cursor not-allowed.
 *
 * Novo controle de formulário deve usar uma destas listas, nunca classes próprias de cor/borda.
 */

// Controle que é o próprio elemento focável (Input, Textarea, Select trigger...).
export const fieldControlClassName = cn(`
  h-11 w-full min-w-0 rounded-lg border border-input-border bg-input-background px-2.5 py-1
  text-base text-foreground transition-colors outline-none placeholder:text-placeholder/80
  disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50
  aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm
  dark:disabled:bg-input/80 dark:aria-invalid:ring-destructive/40
`);

// Contêiner que envolve um controle e complementos (InputGroup): os estados vêm do controle interno.
export const fieldGroupClassName = cn(`
  h-11 w-full min-w-0 rounded-lg border border-input-border bg-input-background text-base
  text-foreground transition-colors outline-none has-disabled:cursor-not-allowed
  has-disabled:bg-input/50 has-disabled:opacity-50
  has-[[data-slot][aria-invalid=true]]:border-destructive
  has-[[data-slot][aria-invalid=true]]:ring-3
  has-[[data-slot][aria-invalid=true]]:ring-destructive/20 md:text-sm dark:has-disabled:bg-input/80
  dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40
`);
