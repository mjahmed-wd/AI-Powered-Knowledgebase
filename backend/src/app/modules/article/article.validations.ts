import { z } from 'zod';

const create = z.object({
  body: z.object({
    title: z.string({ required_error: 'Article title is required' }).min(1).trim(),
    body: z.string({ required_error: 'Article body is required' }).min(1).trim(),
    tagIds: z.array(z.string().uuid()).optional(),
  }),
});

const update = z.object({
  body: z.object({
    title: z.string().min(1).trim().optional(),
    body: z.string().min(1).trim().optional(),
    tagIds: z.array(z.string().uuid()).optional(),
  }),
});

const advancedSearch = z.object({
  body: z.object({
    searchTerm: z.string().trim().optional(),
    authorId: z.string().uuid().optional(),
    tagIds: z.array(z.string().uuid()).optional(),
  }),
});

export const ArticleValidation = {
  create,
  update,
  advancedSearch,
};
