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

// ============================================================
// MOCK IMPLEMENTATION - Remove when backend is ready
// ============================================================
const MOCK_ENABLED = true;

// Store last logged-in user for getCurrentUser mock
let mockCurrentUser: User | null = null;

const mockLogin = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(() => resolve(undefined), 500));

  // Accept only when username === password
  if (username !== password) {
    throw new Error('Invalid credentials');
  }

  let role: UserRole;
  switch (username.toLowerCase()) {
    case 'admin':
      role = 'HR_ADMIN';
      break;
    case 'manager':
      role = 'MANAGER';
      break;
    case 'employee':
      role = 'EMPLOYEE';
      break;
    default:
      throw new Error('Invalid credentials');
  }

  const user: User = {
    id: '1',
    name: username,
    role,
  };

  // Store for getCurrentUser
  mockCurrentUser = user;

  return {
    token: 'mock-jwt-token',
    user,
  };
};

const mockGetCurrentUser = async (): Promise<User> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(() => resolve(undefined), 200));

  if (!mockCurrentUser) {
    throw new Error('No authenticated user');
  }

  return mockCurrentUser;
};
// ============================================================
// END MOCK IMPLEMENTATION
// ============================================================

/**
 * Login with username and password
 * POST /auth/login
 */
export const login = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  if (MOCK_ENABLED) {
    return mockLogin(username, password);
  }

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
  if (MOCK_ENABLED) {
    return mockGetCurrentUser();
  }

  const response = await api.get<User>('/auth/me');
  return response.data;
};
