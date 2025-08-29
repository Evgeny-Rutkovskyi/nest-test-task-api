import { z } from 'zod';

export const updateUserSchema = z
    .object({
        id: z.number().int().positive(),
        name: z.string().min(2).max(50).optional(),
        email: z.email().optional(),
    })

export type UpdateUserZodDto = z.infer<typeof updateUserSchema>;