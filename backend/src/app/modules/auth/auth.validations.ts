import { z } from 'zod';

const loginZodSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
});

export const authValidation = {
  loginZodSchema,
};
