import { User } from '@prisma/client';
import { IGenericErrorMessage } from './error';

export type IGenericResponse<T> = {
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: T;
};

export type IGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorMessages: IGenericErrorMessage[];
};

// User type without password for API responses
export type UserWithoutPassword = Omit<User, 'password'>;

// User select object to exclude password from Prisma queries
export const userSelectWithoutPassword = {
  id: true,
  name: true,
  email: true,
  role: true,
  password: false,
  createdAt: false,
  updatedAt: false,
};
