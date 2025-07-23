import httpClient from '@/config/http';
import { API_ENDPOINTS } from '@/config/apiEndpoints';
import {
  Tag,
  CreateTagRequest,
  UpdateTagRequest,
  TagListResponse,
  PaginationParams,
} from '@/types/api';

export const getAllTags = async (params?: PaginationParams): Promise<TagListResponse> => {
  const queryParams = new URLSearchParams();
  
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

  const url = `${API_ENDPOINTS.TAGS.GET_ALL}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  
  const response = await httpClient.get<TagListResponse>(url);
  return response.data!;
};

export const getAllTagsSimple = async (): Promise<Tag[]> => {
  const response = await httpClient.get<Tag[]>(API_ENDPOINTS.TAGS.GET_ALL);
  return response.data!;
};

export const createTag = async (tagData: CreateTagRequest): Promise<Tag> => {
  const response = await httpClient.post<Tag>(
    API_ENDPOINTS.TAGS.CREATE,
    tagData
  );
  return response.data!;
};

export const getTagById = async (tagId: string): Promise<Tag> => {
  const response = await httpClient.get<Tag>(
    API_ENDPOINTS.TAGS.GET_BY_ID(tagId)
  );
  return response.data!;
};

export const updateTag = async (
  tagId: string,
  tagData: UpdateTagRequest
): Promise<Tag> => {
  const response = await httpClient.patch<Tag>(
    API_ENDPOINTS.TAGS.UPDATE(tagId),
    tagData
  );
  return response.data!;
};

export const deleteTag = async (tagId: string): Promise<void> => {
  await httpClient.delete(API_ENDPOINTS.TAGS.DELETE(tagId));
};

export const searchTags = async (searchTerm: string): Promise<Tag[]> => {
  const allTags = await getAllTagsSimple();
  return allTags.filter(tag => 
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

export const getPopularTags = async (limit: number = 10): Promise<Tag[]> => {
  const response = await getAllTags({ limit, sortBy: 'name', sortOrder: 'asc' });
  return response.data;
};
