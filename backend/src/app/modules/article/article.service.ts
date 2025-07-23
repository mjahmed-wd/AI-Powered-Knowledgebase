import httpStatus from 'http-status';
import { Prisma, Article } from '@prisma/client';

import {
  articleRelationalFields,
  articleRelationalFieldsMapper,
  articleSearchableFields,
  articleSelectFields,
} from './article.constants';
import { IArticleFilterRequest, IArticleCreateRequest, IArticleUpdateRequest, IAdvancedSearchRequest } from './article.interface';
import prisma from '../../../shared/prisma';
import ApiError from '../../../errors/ApiError';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { paginationHelpers } from '../../../helpers/paginationHelper';

const insertIntoDB = async (data: IArticleCreateRequest, authorId: string): Promise<any> => {
  const { tagIds, ...articleData } = data;

  const authorExists = await prisma.user.findUnique({
    where: { id: authorId },
    select: { id: true }
  });

  if (!authorExists) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Author not found'
    );
  }

  if (tagIds && tagIds.length > 0) {
    const existingTags = await prisma.tag.findMany({
      where: {
        id: {
          in: tagIds
        }
      }
    });

    if (existingTags.length !== tagIds.length) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'One or more tag IDs are invalid'
      );
    }
  }

  const result = await prisma.article.create({
    data: {
      ...articleData,
      authorId,
      tags: tagIds && tagIds.length > 0 ? {
        connect: tagIds.map(id => ({ id }))
      } : undefined
    },
    select: articleSelectFields,
  });

  return result;
};

const getMyArticles = async (
  authorId: string,
  filters: IArticleFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<any[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, tagId, ...filterData } = filters;

  const andConditions = [];

  andConditions.push({
    authorId
  });

  if (searchTerm) {
    andConditions.push({
      OR: articleSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (tagId) {
    andConditions.push({
      tags: {
        some: {
          id: tagId
        }
      }
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => {
        if (articleRelationalFields.includes(key)) {
          return {
            [articleRelationalFieldsMapper[key]]: {
              id: (filterData as any)[key],
            },
          };
        } else {
          return {
            [key]: {
              equals: (filterData as any)[key],
            },
          };
        }
      }),
    });
  }

  const whereConditions: Prisma.ArticleWhereInput = { AND: andConditions };

  const result = await prisma.article.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      createdAt: 'desc'
    },
    select: articleSelectFields,
  });

  const total = await prisma.article.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getByIdFromDB = async (id: string): Promise<any | null> => {
  const result = await prisma.article.findUnique({
    where: {
      id,
    },
    select: articleSelectFields,
  });
  return result;
};

const updateIntoDB = async (
  id: string,
  payload: IArticleUpdateRequest,
  authorId: string
): Promise<any> => {
  const existingArticle = await prisma.article.findUnique({
    where: { id },
    select: { id: true, authorId: true }
  });

  if (!existingArticle) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Article not found');
  }

  if (existingArticle.authorId !== authorId) {
    throw new ApiError(
      httpStatus.FORBIDDEN, 
      'You can only update your own articles'
    );
  }

  const { tagIds, ...articleData } = payload;

  if (tagIds && tagIds.length > 0) {
    const existingTags = await prisma.tag.findMany({
      where: {
        id: {
          in: tagIds
        }
      }
    });

    if (existingTags.length !== tagIds.length) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'One or more tag IDs are invalid'
      );
    }
  }

  const result = await prisma.article.update({
    where: {
      id,
    },
    data: {
      ...articleData,
      tags: tagIds !== undefined ? {
        set: tagIds.map(id => ({ id }))
      } : undefined
    },
    select: articleSelectFields,
  });

  return result;
};

const deleteFromDB = async (id: string, authorId: string): Promise<any> => {
  const existingArticle = await prisma.article.findUnique({
    where: { id },
    select: { id: true, authorId: true }
  });

  if (!existingArticle) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Article not found');
  }

  if (existingArticle.authorId !== authorId) {
    throw new ApiError(
      httpStatus.FORBIDDEN, 
      'You can only delete your own articles'
    );
  }

  const result = await prisma.article.delete({
    where: {
      id,
    },
    select: articleSelectFields,
  });

  return result;
};

const summarizeArticle = async (id: string): Promise<{ summary: string }> => {
  const article = await prisma.article.findUnique({
    where: { id },
    select: { id: true, title: true, body: true }
  });

  if (!article) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Article not found');
  }

  // Mock AI summary response - you can replace this with actual AI integration later
  const mockSummary = `This is a mock summary of the article "${article.title}". The article discusses various aspects of the topic and provides insights into ${article.body.substring(0, 50)}... In conclusion, the article offers valuable information and perspectives on the subject matter.`;

  return {
    summary: mockSummary
  };
};

const advancedSearch = async (
  searchCriteria: IAdvancedSearchRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<any[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { 
    searchTerm, 
    authorId, 
    tagIds
  } = searchCriteria;

  const andConditions = [];

  // searches in both title and body
  if (searchTerm) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: searchTerm,
            mode: 'insensitive' as const,
          },
        },
        {
          body: {
            contains: searchTerm,
            mode: 'insensitive' as const,
          },
        },
      ],
    });
  }

  if (authorId) {
    andConditions.push({
      authorId: authorId,
    });
  }

  if (tagIds && tagIds.length > 0) {
    andConditions.push({
      tags: {
        some: {
          id: {
            in: tagIds
          }
        }
      }
    });
  }

  const whereConditions: Prisma.ArticleWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.article.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      createdAt: 'desc'
    },
    select: articleSelectFields,
  });

  const total = await prisma.article.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

export const ArticleService = {
  insertIntoDB,
  getMyArticles,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
  summarizeArticle,
  advancedSearch,
};
