import { z } from 'zod';

export const registerSchema = z
    .object({
        email: z.email(),
        password: z.string().min(4).max(15),
        name: z.string()
    })
    .required()

export type RegisterZodDto = z.infer<typeof registerSchema>;