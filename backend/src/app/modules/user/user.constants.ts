import { User } from "@prisma/client";

export const userFilterableFields: string[] = [
  'searchTerm',
  'name',
  'email',
  'role'
];

export const userSearchableFields: string[] = [
  'name',
  'email',
  'id'
];

export const userRelationalFields: string[] = [
  'articles'
];

export const userRelationalFieldsMapper: { [key: string]: string } = {
  articlesId: 'articles'
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
