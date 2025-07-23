import { useAppDispatch, useAppSelector } from '@/store';
import {
    clearError,
    selectAuth,
    selectAuthError,
    selectAuthLoading,
    selectIsAuthenticated,
    selectUser,
} from '@/store/slices/authSlice';
import {
    getUserProfile,
    signInUser,
    signOutUser,
    signUpUser
} from '@/store/slices/authThunks';
import { CreateUserRequest, SignInRequest } from '@/types/api';
import { useCallback } from 'react';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  
  const authState = useAppSelector(selectAuth);
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  const signIn = useCallback(
    async (credentials: SignInRequest) => {
      try {
        const result = await dispatch(signInUser(credentials)).unwrap();
        return { success: true, data: result };
      } catch (error) {
        return { success: false, error: error as string };
      }
    },
    [dispatch]
  );

  const signUp = useCallback(
    async (userData: CreateUserRequest) => {
      try {
        const result = await dispatch(signUpUser(userData)).unwrap();
        return { success: true, data: result };
      } catch (error) {
        return { success: false, error: error as string };
      }
    },
    [dispatch]
  );

  const signOut = useCallback(() => {
    dispatch(signOutUser());
  }, [dispatch]);

  const getProfile = useCallback(
    async (userId: string) => {
      try {
        const result = await dispatch(getUserProfile(userId)).unwrap();
        return { success: true, data: result };
      } catch (error) {
        return { success: false, error: error as string };
      }
    },
    [dispatch]
  );

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    authState,
    user,
    isAuthenticated,
    isLoading,
    error,
    signIn,
    signUp,
    signOut,
    getProfile,
    clearAuthError,
  };
};
