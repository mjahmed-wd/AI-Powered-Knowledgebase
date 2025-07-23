import httpClient from '@/config/http';
import { API_ENDPOINTS } from '@/config/apiEndpoints';
import {
  SignInRequest,
  CreateUserRequest,
  UpdateUserRequest,
  AuthResponse,
  User,
} from '@/types/api';

export const signUp = async (userData: CreateUserRequest): Promise<User> => {
  const response = await httpClient.post<User>(
    API_ENDPOINTS.AUTH.SIGNUP,
    userData
  );
  return response.data!;
};

export const signIn = async (credentials: SignInRequest): Promise<AuthResponse> => {
  const response = await httpClient.post<AuthResponse>(
    API_ENDPOINTS.AUTH.SIGNIN,
    credentials
  );
  
  if (response.data?.accessToken) {
    httpClient.setAuthToken(response.data.accessToken);
  }
  
  return response.data!;
};

export const getUserProfile = async (userId: string): Promise<User> => {
  const response = await httpClient.get<User>(
    API_ENDPOINTS.AUTH.USER_PROFILE(userId)
  );
  return response.data!;
};

export const updateUserProfile = async (
  userId: string,
  userData: UpdateUserRequest
): Promise<User> => {
  const response = await httpClient.patch<User>(
    API_ENDPOINTS.AUTH.USER_PROFILE(userId),
    userData
  );
  return response.data!;
};

export const deleteUserAccount = async (userId: string): Promise<void> => {
  await httpClient.delete(API_ENDPOINTS.AUTH.USER_PROFILE(userId));
};

export const signOut = (): void => {
  httpClient.clearAuthToken();
};

export const isAuthenticated = (): boolean => {
  if (typeof window !== 'undefined') {
    return !!localStorage.getItem('authToken');
  }
  return false;
};

export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

export const getStoredUser = (): User | null => {
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }
  return null;
};

export const storeUser = (user: User): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user));
  }
};
