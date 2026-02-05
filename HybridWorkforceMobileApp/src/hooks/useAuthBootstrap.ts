import { useState, useEffect } from 'react';
import { getToken, clearToken } from '../utils/authStorage';
import { getCurrentUser, User } from '../services/authService';

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export interface AuthState {
  status: AuthStatus;
  user: User | null;
}

/**
 * Hook to check authentication state on app startup
 * Attempts to restore session using stored token
 */
export const useAuthBootstrap = (): AuthState => {
  const [authState, setAuthState] = useState<AuthState>({
    status: 'loading',
    user: null,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await getToken();

        if (!token) {
          setAuthState({ status: 'unauthenticated', user: null });
          return;
        }

        // Token exists, validate by fetching current user
        const user = await getCurrentUser();
        setAuthState({ status: 'authenticated', user });
      } catch (error) {
        // Token invalid or API error - clear and set unauthenticated
        await clearToken();
        setAuthState({ status: 'unauthenticated', user: null });
      }
    };

    checkAuth();
  }, []);

  return authState;
};
