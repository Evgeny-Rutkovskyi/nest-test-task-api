import { z } from 'zod';

export const loginSchema = z
    .object({
        email: z.email(),
        password: z.string().min(4).max(15),
    })
    .required()

export type LoginZodDto = z.infer<typeof loginSchema>;