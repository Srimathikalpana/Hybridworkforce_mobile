import api from './api';

// Types
export type UserRole = 'EMPLOYEE' | 'MANAGER' | 'HR_ADMIN' | 'SYS_ADMIN';

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export interface LoginResponse {
  token: string;
  user: User;
}

interface LoginRequest {
  username: string;
  password: string;
  deviceType: 'MOBILE';
}

/**
 * Login with username and password
 * POST /auth/login
 */
export const login = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  const requestBody: LoginRequest = {
    username,
    password,
    deviceType: 'MOBILE',
  };

  const response = await api.post<LoginResponse>('/auth/login', requestBody);
  return response.data;
};

/**
 * Get current authenticated user profile
 * GET /auth/me
 * Uses JWT automatically via Axios interceptor
 */
export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<User>('/auth/me');
  return response.data;
};
