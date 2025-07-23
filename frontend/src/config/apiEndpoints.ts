const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/v1';

export const API_ENDPOINTS = {
  BASE_URL,
  AUTH: {
    SIGNUP: '/auth/signup',
    SIGNIN: '/auth/signin',
    USER_PROFILE: (id: string) => `/auth/${id}`, // GET, PATCH, DELETE
  },
  USERS: {
    GET_ALL: '/users',
    GET_BY_ID: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
  },
  ARTICLES: {
    CREATE: '/articles',
    GET_MY_ARTICLES: '/articles/my-articles',
    SEARCH: '/articles/search',
    GET_BY_ID: (id: string) => `/articles/${id}`,
    UPDATE: (id: string) => `/articles/${id}`,
    DELETE: (id: string) => `/articles/${id}`,
    SUMMARIZE: (id: string) => `/articles/${id}/summarize`,
  },
  TAGS: {
    GET_ALL: '/tags',
    CREATE: '/tags',
    GET_BY_ID: (id: string) => `/tags/${id}`,
    UPDATE: (id: string) => `/tags/${id}`,
    DELETE: (id: string) => `/tags/${id}`,
  },
} as const;

export interface APIResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
  data?: T;
}

export interface APIError {
  success: false;
  statusCode: number;
  message: string;
  errorMessages?: Array<{
    path: string;
    message: string;
  }>;
}

export default API_ENDPOINTS;
