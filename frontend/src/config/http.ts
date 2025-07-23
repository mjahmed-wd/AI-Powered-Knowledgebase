import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_ENDPOINTS, APIResponse, APIError } from '@/config/apiEndpoints';
import store from '@/store';

// Function to get auth token - will be used by interceptor
let getTokenFunction: (() => string | null) = () => {
    const state = store.getState();
    if (state.auth.isAuthenticated && state.auth.user) {
        return state.auth.token || null;
    }
    return null;
};

// Function to handle unauthorized requests - will be set by the auth system
let handleUnauthorizedFunction: (() => void) | null = null;

// Allow setting the token getter function from outside
export const setTokenGetter = (tokenGetter: () => string | null) => {
  getTokenFunction = tokenGetter;
};

// Allow setting the unauthorized handler from outside
export const setUnauthorizedHandler = (handler: () => void) => {
  handleUnauthorizedFunction = handler;
};

const getAuthToken = (): string | null => {
  // First try the external function (from Redux)
  if (getTokenFunction) {
    return getTokenFunction();
  }
  
  // Fallback to localStorage
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

const handleUnauthorized = (): void => {
  // Use external handler if available
  if (handleUnauthorizedFunction) {
    handleUnauthorizedFunction();
    return;
  }

  // Fallback to localStorage cleanup
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    // Redirect to login
    window.location.href = '/login';
  }
};

const setupInterceptors = (instance: AxiosInstance): void => {
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = getAuthToken();
      if (token && config.headers) {
        config.headers.Authorization = `${token}`;
      }
      return config;
    },
    (error: AxiosError) => {
      console.error('Request Error:', error);
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response: AxiosResponse<APIResponse>) => {
      return response;
    },
    (error: AxiosError<APIError>) => {
      if (error.response) {
        const { status, data } = error.response;

        if (status === 401) {
          handleUnauthorized();
        }

        return Promise.reject(data || error);
      }

      if (error.request) {
        return Promise.reject({
          success: false,
          statusCode: 0,
          message: 'Network error. Please check your connection.',
        });
      }

      return Promise.reject({
        success: false,
        statusCode: 0,
        message: error.message,
      });
    }
  );
};

const createHttpClient = () => {
  const instance = axios.create({
    baseURL: API_ENDPOINTS.BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  setupInterceptors(instance);

  return {
    get: async <T = unknown>(url: string, config?: object): Promise<APIResponse<T>> => {
      const response = await instance.get(url, config);
      return response.data;
    },

    post: async <T = unknown>(url: string, data?: unknown, config?: object): Promise<APIResponse<T>> => {
      const response = await instance.post(url, data, config);
      return response.data;
    },

    put: async <T = unknown>(url: string, data?: unknown, config?: object): Promise<APIResponse<T>> => {
      const response = await instance.put(url, data, config);
      return response.data;
    },

    patch: async <T = unknown>(url: string, data?: unknown, config?: object): Promise<APIResponse<T>> => {
      const response = await instance.patch(url, data, config);
      return response.data;
    },

    delete: async <T = unknown>(url: string, config?: object): Promise<APIResponse<T>> => {
      const response = await instance.delete(url, config);
      return response.data;
    },

    setAuthToken: (token: string): void => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', token);
      }
    },

    clearAuthToken: (): void => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    },
  };
};

const httpClient = createHttpClient();
export default httpClient;
