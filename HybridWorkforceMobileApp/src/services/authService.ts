import api from './api';

// Types
export type UserRole = 'EMPLOYEE' | 'MANAGER' | 'HR_ADMIN' | 'SYS_ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  teamId?: string | null;
  isActive?: boolean;
  createdAt?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

interface LoginRequest {
  email: string;
  password: string;
  deviceType: 'MOBILE';
}

/**
 * Login with email and password
 * POST /auth/login
 */
export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const requestBody: LoginRequest = {
    email,
    password,
    deviceType: 'MOBILE',
  };

  const response = await api.post<{ token: string; user: User }>('/auth/login', requestBody);
  return { token: response.data.token, user: response.data.user };
};

/**
 * Get current authenticated user profile
 * GET /auth/me
 * Uses JWT automatically via Axios interceptor
 */
export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<{ user: User }>('/auth/me');
  return response.data.user;
};
