import httpClient from '@/config/http';
import { API_ENDPOINTS } from '@/config/apiEndpoints';
import {
  Article,
  CreateArticleRequest,
  UpdateArticleRequest,
  ArticleSearchRequest,
  ArticleSummary,
  PaginationParams,
  PaginatedResponse,
} from '@/types/api';

export const createArticle = async (articleData: CreateArticleRequest): Promise<Article> => {
  const response = await httpClient.post<Article>(
    API_ENDPOINTS.ARTICLES.CREATE,
    articleData
  );
  return response.data!;
};

export const getMyArticles = async (): Promise<Article[]> => {
  const response = await httpClient.get<Article[]>(
    API_ENDPOINTS.ARTICLES.GET_MY_ARTICLES
  );
  return response.data!;
};

export const searchArticles = async (
  searchParams: ArticleSearchRequest,
  paginationParams?: PaginationParams
) => {
  const queryParams = new URLSearchParams();
  if (paginationParams?.page) queryParams.set('page', paginationParams.page.toString());
  if (paginationParams?.limit) queryParams.set('limit', paginationParams.limit.toString());
  if (paginationParams?.sortBy) queryParams.set('sortBy', paginationParams.sortBy);
  if (paginationParams?.sortOrder) queryParams.set('sortOrder', paginationParams.sortOrder);

  const url = `${API_ENDPOINTS.ARTICLES.SEARCH}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  
  const response = await httpClient.post<Article[]>(
    url,
    searchParams
  );

  const paginatedResponse: PaginatedResponse<Article> = {
    data: response.data!,
    meta: {
      page: response.meta?.page || 1,
      limit: response.meta?.limit || 10,
      total: response.meta?.total || 0,
      totalPages: Math.ceil((response.meta?.total || 0) / (response.meta?.limit || 1)),
    }
  };
  return paginatedResponse;
};

export const getArticleById = async (articleId: string): Promise<Article> => {
  const response = await httpClient.get<Article>(
    API_ENDPOINTS.ARTICLES.GET_BY_ID(articleId)
  );
  return response.data!;
};

export const updateArticle = async (
  articleId: string,
  articleData: UpdateArticleRequest
): Promise<Article> => {
  const response = await httpClient.patch<Article>(
    API_ENDPOINTS.ARTICLES.UPDATE(articleId),
    articleData
  );
  return response.data!;
};

export const deleteArticle = async (articleId: string): Promise<void> => {
  await httpClient.delete(API_ENDPOINTS.ARTICLES.DELETE(articleId));
};

export const summarizeArticle = async (articleId: string): Promise<ArticleSummary> => {
  const response = await httpClient.get<ArticleSummary>(
    API_ENDPOINTS.ARTICLES.SUMMARIZE(articleId)
  );
  return response.data!;
};

export const simpleSearch = async (searchTerm: string, tagIds?: string[]): Promise<Article[]> => {
  const result = await searchArticles({
    searchTerm,
    tagIds,
  }, {
    page: 1,
    limit: 10,
  });
  return result.data;
};

export const getArticlesByTag = async (tagId: string): Promise<Article[]> => {
  const result = await searchArticles({
    tagIds: [tagId],
  }, {
    page: 1,
    limit: 10,
  });
  return result.data;
};

export const getLatestArticles = async (limit: number = 10): Promise<Article[]> => {
  const result = await searchArticles({}, {
    page: 1,
    limit,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  return result.data;
};
