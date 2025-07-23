import { Article } from "@prisma/client";

export const articleFilterableFields: string[] = [
  'searchTerm',
  'authorId',
  'tagId'
];

export const paginationFields: string[] = [
  'limit',
  'page',
  'sortBy',
  'sortOrder'
];

export const articleSearchableFields: string[] = [
  'title',
  'body',
  'id'
];

export const articleRelationalFields: string[] = [
  'author',
  'tags'
];

export const articleRelationalFieldsMapper: { [key: string]: string } = {
  authorId: 'author',
  tagId: 'tags'
};

export type ArticleWithoutTimestamps = Omit<Article, 'createdAt' | 'updatedAt'>;

export const articleSelectFields = {
  id: true,
  title: true,
  body: true,
  authorId: true,
  author: {
    select: {
      id: true,
      name: true,
      email: true
    }
  },
  tags: {
    select: {
      id: true,
      name: true
    }
  },
  createdAt: true,
  updatedAt: true,
};
