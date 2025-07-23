import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { Prisma, User } from '@prisma/client';

import {
  userRelationalFields,
  userRelationalFieldsMapper,
  userSearchableFields,
  userSelectWithoutPassword,
  UserWithoutPassword,
} from './user.constants';
import { IUserFilterRequest } from './user.interface';
import config from '../../../config';
import prisma from '../../../shared/prisma';
import ApiError from '../../../errors/ApiError';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { paginationHelpers } from '../../../helpers/paginationHelper';

const insertIntoDB = async (data: Prisma.UserCreateInput): Promise<UserWithoutPassword> => {
  const isExist = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });
  if (isExist) {
    throw new ApiError(
      httpStatus.CONFLICT,
      'User already exist with this email'
    );
  }

  // Hash password before saving
  const saltRounds = Number(config.bycrypt_salt_rounds) || 12;
  const hashedPassword = await bcrypt.hash(data.password, saltRounds);

  const result = await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
      role: data.role || ENUM_USER_ROLE.USER,
    },
    select: userSelectWithoutPassword,
  });
  return result;
};

const getAllFromDB = async (
  filters: IUserFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<UserWithoutPassword[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: userSearchableFields.map(field => ({
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
        if (userRelationalFields.includes(key)) {
          return {
            [userRelationalFieldsMapper[key]]: {
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

  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      createdAt: 'desc'
    },
    select: userSelectWithoutPassword,
  });
  const total = await prisma.user.count({
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

const getByIdFromDB = async (id: string): Promise<UserWithoutPassword | null> => {
  const result = await prisma.user.findUnique({
    where: {
      id,
    },
    select: userSelectWithoutPassword,
  });
  return result;
};

const updateIntoDB = async (
  id: string,
  payload: Prisma.UserUpdateInput
): Promise<UserWithoutPassword> => {
  // If password is being updated, hash it
  if (payload.password && typeof payload.password === 'string') {
    const saltRounds = Number(config.bycrypt_salt_rounds) || 12;
    payload.password = await bcrypt.hash(payload.password, saltRounds);
  }

  const result = await prisma.user.update({
    where: {
      id,
    },
    data: {
      ...payload,
      role: payload.role || 'user',
    },
    select: userSelectWithoutPassword,
  });
  return result;
};

const deleteFromDB = async (id: string): Promise<UserWithoutPassword> => {
  const result = await prisma.user.delete({
    where: {
      id,
    },
    select: userSelectWithoutPassword,
  });
  return result;
};

export const UserService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
};
