import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import { IAuthRequest } from './auth.interface';
import { UserWithoutPassword, userSelectWithoutPassword } from '../../../interfaces/common';

const signIn = async (data: IAuthRequest): Promise<UserWithoutPassword> => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Wrong email or password');
  }

  const isPasswordMatch = await bcrypt.compare(
    data.password,
    isUserExist.password
  );

  if (!isPasswordMatch) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Wrong email or password');
  }

  // Return user without password
  const userWithoutPassword = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
    select: userSelectWithoutPassword,
  });

  return userWithoutPassword!; // We know it exists since we just found it
};

export const AuthService = {
  signIn,
};
