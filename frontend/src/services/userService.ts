import httpClient from '@/config/http';
import { API_ENDPOINTS } from '@/config/apiEndpoints';
import {
  User,
  UpdateUserRequest,
  UserListResponse,
  PaginationParams,
} from '@/types/api';

export const getAllUsers = async (params?: PaginationParams): Promise<UserListResponse> => {
  const queryParams = new URLSearchParams();
  
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

  const url = `${API_ENDPOINTS.USERS.GET_ALL}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  
  const response = await httpClient.get<UserListResponse>(url);
  return response.data!;
};

export const getUserById = async (userId: string): Promise<User> => {
  const response = await httpClient.get<User>(
    API_ENDPOINTS.USERS.GET_BY_ID(userId)
  );
  return response.data!;
};

export const updateUser = async (
  userId: string,
  userData: UpdateUserRequest
): Promise<User> => {
  const response = await httpClient.patch<User>(
    API_ENDPOINTS.USERS.UPDATE(userId),
    userData
  );
  return response.data!;
};

export const deleteUser = async (userId: string): Promise<void> => {
  await httpClient.delete(API_ENDPOINTS.USERS.DELETE(userId));
};
