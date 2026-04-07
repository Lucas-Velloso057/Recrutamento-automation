import { z } from 'zod';

// Constante para o tamanho máximo do ficheiro (ex: 5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

export const candidateSchema = z.object({
  fullName: z.string().min(3, 'O nome completo é obrigatório e deve ter no mínimo 3 caracteres.'),
  email: z.string().email('Forneça um e-mail válido para contacto.'),
  linkedIn: z.string().url('O link do LinkedIn deve ser um URL válido.').optional(),
  position: z.enum(['Frontend', 'Backend', 'Fullstack', 'Design'], {
    message: 'Selecione uma vaga válida.',
  }),
  // Simulação de validação de ficheiro no frontend
  resume: z.any()
    .refine((files) => files?.length == 1, 'O envio do currículo é obrigatório.')
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, 'O tamanho máximo permitido é de 5MB.')
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      'Apenas são aceites ficheiros em formato PDF ou Word.'
    ),
});

// Inferimos o tipo TypeScript diretamente do Zod para usar nos componentes
export type CandidateFormData = z.infer<typeof candidateSchema>;