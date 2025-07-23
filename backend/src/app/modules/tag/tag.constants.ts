import { Tag } from "@prisma/client";

export const tagFilterableFields: string[] = [
  'searchTerm',
  'name'
];

export const tagSearchableFields: string[] = [
  'name',
  'id'
];

export const tagRelationalFields: string[] = [
  'articles'
];

export const tagRelationalFieldsMapper: { [key: string]: string } = {
  articlesId: 'articles'
};


export type TagWithoutUnusedField = Omit<Tag, 'createdAt' | 'updatedAt'>;

// Tag select object to exclude unused fields from Prisma queries
export const tagSelectFields = {
  id: true,
  name: true,
  articles: true,
  createdAt: false,
  updatedAt: false,
};
