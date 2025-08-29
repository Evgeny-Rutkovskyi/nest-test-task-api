import { z } from 'zod';

export const createUpdateNotesSchema = z
    .object({
        title: z.string(),
        description: z.string(),
    })
    .required()

export type CreateUpdateNotesZodDto = z.infer<typeof createUpdateNotesSchema>;