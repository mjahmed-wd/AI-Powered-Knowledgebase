import httpStatus from 'http-status';
import { Prisma, Tag } from '@prisma/client';

import {
  tagRelationalFields,
  tagRelationalFieldsMapper,
  tagSearchableFields,
  tagSelectFields,
} from './tag.constants';
import { ITagFilterRequest } from './tag.interface';
import prisma from '../../../shared/prisma';
import ApiError from '../../../errors/ApiError';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { paginationHelpers } from '../../../helpers/paginationHelper';

const insertIntoDB = async (data: Prisma.TagCreateInput): Promise<Tag> => {
  const isExist = await prisma.tag.findUnique({
    where: {
      name: data.name,
    },
    select: tagSelectFields
  });
  if (isExist) {
    throw new ApiError(
      httpStatus.CONFLICT,
      'Tag already exist with this name'
    );
  }

  const result = await prisma.tag.create({
    data,
    select: tagSelectFields,
  });
  return result;
};

const getAllFromDB = async (
  filters: ITagFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Tag[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: tagSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => {
        if (tagRelationalFields.includes(key)) {
          return {
            [tagRelationalFieldsMapper[key]]: {
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

  const whereConditions: Prisma.TagWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.tag.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      createdAt: 'desc'
    },
    select: tagSelectFields,
  });
  const total = await prisma.tag.count({
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

const getByIdFromDB = async (id: string): Promise<Tag | null> => {
  const result = await prisma.tag.findUnique({
    where: {
      id,
    },
    select: tagSelectFields,
  });
  return result;
};

const updateIntoDB = async (
  id: string,
  payload: Prisma.TagUpdateInput
): Promise<Tag> => {
  // Check if tag exists
  const existingTag = await prisma.tag.findUnique({
    where: { id },
    select: tagSelectFields
  });

  if (!existingTag) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Tag not found');
  }

  // Check if the new name already exists (if name is being updated)
  if (payload.name && payload.name !== existingTag.name) {
    const nameExists = await prisma.tag.findUnique({
      where: { name: payload.name as string }
    });

    if (nameExists) {
      throw new ApiError(
        httpStatus.CONFLICT,
        'Tag already exist with this name'
      );
    }
  }

  const result = await prisma.tag.update({
    where: {
      id,
    },
    data: payload,
    select: tagSelectFields,
  });
  return result;
};

const deleteFromDB = async (id: string): Promise<Tag> => {
  // Check if tag exists
  const existingTag = await prisma.tag.findUnique({
    where: { id },
    select: tagSelectFields
  });

  if (!existingTag) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Tag not found');
  }

  const result = await prisma.tag.delete({
    where: {
      id,
    },
    select: tagSelectFields,
  });
  return result;
};

export const TagService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
};
