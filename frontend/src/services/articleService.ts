import httpClient from '@/config/http';
import { API_ENDPOINTS } from '@/config/apiEndpoints';
import {
  Article,
  CreateArticleRequest,
  UpdateArticleRequest,
  ArticleSearchRequest,
  ArticleListResponse,
  ArticleSummary,
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

export const searchArticles = async (searchParams: ArticleSearchRequest): Promise<ArticleListResponse> => {
  const response = await httpClient.post<ArticleListResponse>(
    API_ENDPOINTS.ARTICLES.SEARCH,
    searchParams
  );
  return response.data!;
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

export const simpleSearch = async (searchTerm: string, tagIds?: string[]): Promise<ArticleListResponse> => {
  return searchArticles({
    searchTerm,
    tagIds,
    page: 1,
    limit: 10,
  });
};

export const getArticlesByTag = async (tagId: string): Promise<ArticleListResponse> => {
  return searchArticles({
    tagIds: [tagId],
    page: 1,
    limit: 10,
  });
};

export const getLatestArticles = async (limit: number = 10): Promise<ArticleListResponse> => {
  return searchArticles({
    page: 1,
    limit,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
};
