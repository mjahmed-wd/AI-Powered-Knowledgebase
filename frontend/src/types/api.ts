
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
}

export interface UpdateUserRequest {
  email?: string;
  name?: string;
  password?: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignInResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: User;
  token: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Article {
  id: string;
  title: string;
  body: string;
  authorId: string;
  author?: User;
  tags?: Tag[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateArticleRequest {
  title: string;
  body: string;
  tagIds?: string[];
}

export interface UpdateArticleRequest {
  title?: string;
  body?: string;
  tagIds?: string[];
}

export interface ArticleSearchRequest {
  searchTerm?: string;
  tagIds?: string[];
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ArticleSummary {
  id: string;
  summary: string;
}

export interface Tag {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTagRequest {
  name: string;
  description?: string;
}

export interface UpdateTagRequest {
  name?: string;
  description?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export type UserListResponse = PaginatedResponse<User>;
export type ArticleListResponse = PaginatedResponse<Article>;
export type TagListResponse = PaginatedResponse<Tag>;
