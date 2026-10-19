import { z } from 'zod';

// RFC 9457 (Problem Details) devolvido pelo BFF: só os campos usados pelo front.
const problemSchema = z.object({
  detail: z.string().optional(),
  fields: z.array(z.string()).optional(),
});

export type ProblemDetails = z.infer<typeof problemSchema>;

// Lê o corpo de erro sem falhar: resposta vazia ou fora do contrato vira {}.
export const readProblemDetails = async (response: Response): Promise<ProblemDetails> => {
  const parsed = problemSchema.safeParse(await response.json().catch(() => null));

  return parsed.success ? parsed.data : {};
};
