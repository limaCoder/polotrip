import { z } from 'zod';

export const albumFormSchema = z.object({
  title: z
    .string()
    .min(3, { message: 'O título deve ter pelo menos 3 caracteres' })
    .max(255, { message: 'O título deve ter no máximo 255 caracteres' }),
  date: z
    .string()
    .min(1, { message: 'A data é obrigatória' })
    .regex(/^\d{4}-\d{2}(-\d{2})?$/, {
      message: 'Formato de data inválido. Use YYYY-MM ou YYYY-MM-DD',
    }),
  description: z
    .string()
    .max(1000, { message: 'A descrição deve ter no máximo 1000 caracteres' })
    .optional()
    .nullable(),
  coverImage: z
    .instanceof(File)
    .refine(file => file.size <= 5 * 1024 * 1024, {
      message: 'A imagem deve ter no máximo 5MB',
    })
    .refine(file => ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type), {
      message: 'O arquivo deve ser uma imagem PNG ou JPG',
    })
    .optional()
    .nullable(),
});

export type AlbumFormData = z.infer<typeof albumFormSchema>;
