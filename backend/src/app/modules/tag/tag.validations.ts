import { z } from 'zod';

const create = z.object({
  body: z.object({
    name: z.string({ required_error: 'Tag name is required' }).min(1).trim(),
  }),
});

const update = z.object({
  body: z.object({
    name: z.string().min(1).trim().optional(),
  }),
});

export const TagValidation = {
  create,
  update,
};
