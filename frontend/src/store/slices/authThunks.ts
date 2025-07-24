import * as authService from '@/services/authService';
import { CreateUserRequest, SignInRequest, User } from '@/types/api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { authFailure, authStart, authSuccess, clearAuth, updateUser, setLoading, clearError } from './authSlice';

interface ErrorResponse {
  message?: string;
}

export const signUpUser = createAsyncThunk(
  'auth/signUp',
  async (userData: CreateUserRequest, { dispatch, rejectWithValue }) => {
    try {
      dispatch(authStart());
      const user = await authService.signUp(userData);

      dispatch(setLoading(false));
      dispatch(clearError());
      
      return user;
    } catch (error: unknown) {
      const message = (error as ErrorResponse)?.message || 'Sign up failed';
      dispatch(authFailure(message));
      return rejectWithValue(message);
    }
  }
);

export const signInUser = createAsyncThunk(
  'auth/signIn',
  async (credentials: SignInRequest, { dispatch, rejectWithValue }) => {
    try {
      dispatch(authStart());
      const authResponse = await authService.signIn(credentials);

      console.log({ authResponse });
      
      // Store token in localStorage as backup
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', authResponse.token);
        localStorage.setItem('user', JSON.stringify(authResponse.user));
      }
      
      dispatch(authSuccess({
        user: authResponse.user,
        token: authResponse.token,
      }));
      
      return authResponse;
    } catch (error: unknown) {
      const message = (error as ErrorResponse)?.message || 'Sign in failed';
      dispatch(authFailure(message));
      return rejectWithValue(message);
    }
  }
);

export const signOutUser = createAsyncThunk(
  'auth/signOut',
  async (_, { dispatch }) => {
    try {
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
      
      authService.signOut();
      dispatch(clearAuth());
    } catch (error: unknown) {
      console.error('Sign out error:', error);
      // Clear state anyway
      dispatch(clearAuth());
      // Clear localStorage as fallback
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
  }
);

export const getUserProfile = createAsyncThunk(
  'auth/getProfile',
  async (userId: string, { dispatch, rejectWithValue }) => {
    try {
      const user = await authService.getUserProfile(userId);
      
      dispatch(updateUser(user));
      return user;
    } catch (error: unknown) {
      const message = (error as ErrorResponse)?.message || 'Failed to get profile';
      return rejectWithValue(message);
    }
  }
);

export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async (_, { dispatch, getState }) => {
    try {
      // Check if already authenticated via Redux state (from persistence)
      const state = getState() as { auth: { isAuthenticated: boolean; token: string | null; user: User | null } };
      
      if (state.auth.isAuthenticated && state.auth.token && state.auth.user) {
        // State is already initialized from persistence, just validate token exists in localStorage
        const localToken = authService.getAuthToken();
        if (localToken && localToken === state.auth.token) {
          return { user: state.auth.user, token: state.auth.token };
        }
      }
      
      // Try to get from localStorage as fallback
      const token = authService.getAuthToken();
      const user = authService.getStoredUser();
      
      if (token && user) {
        dispatch(authSuccess({ user, token }));
        return { user, token };
      } else {
        dispatch(clearAuth());
        return null;
      }
    } catch (error: unknown) {
      console.error('Auth initialization error:', error);
      dispatch(clearAuth());
      return null;
    }
  }
);
