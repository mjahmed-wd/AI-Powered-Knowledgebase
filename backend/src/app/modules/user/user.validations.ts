import { z } from 'zod';
import { ENUM_USER_ROLE } from '../../../enums/user';

const create = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }).min(1),
    email: z.string({ required_error: 'Email is required' }).email(),
    password: z.string({ required_error: 'Password is required' }).min(6),
    role: z.nativeEnum(ENUM_USER_ROLE).optional().default(ENUM_USER_ROLE.USER),
  }),
});

const update = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
    role: z.nativeEnum(ENUM_USER_ROLE).optional(),
  }),
});

export const UserValidation = {
  create,
  update,
};
