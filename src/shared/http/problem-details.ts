import { z } from 'zod';

// RFC 9457 (Problem Details) devolvido pelo BFF: só os campos usados pelo front.
const problemSchema = z.object({
  detail: z.string().optional(),
  fields: z.array(z.string()).optional(),
});

export type ProblemDetails = z.infer<typeof problemSchema>;

// Lê o corpo de erro sem falhar: resposta vazia ou fora do contrato vira {}. Recebe o error.data do
// HTTPError do Ky 2, que já consumiu o corpo (response.json() não funciona mais).
export const readProblemDetails = (data: unknown): ProblemDetails => {
  const parsed = problemSchema.safeParse(data);

  return parsed.success ? parsed.data : {};
};
