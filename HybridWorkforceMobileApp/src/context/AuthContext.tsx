import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getToken, saveToken, clearToken } from '../utils/authStorage';
import { getCurrentUser, User, LoginResponse } from '../services/authService';

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthContextType {
  status: AuthStatus;
  user: User | null;
  signIn: (loginResponse: LoginResponse) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<User | null>(null);

  // Check auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await getToken();

        if (!token) {
          setStatus('unauthenticated');
          return;
        }

        // Token exists, validate by fetching current user
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        setStatus('authenticated');
      } catch (error) {
        // Token invalid or API error - clear and set unauthenticated
        await clearToken();
        setStatus('unauthenticated');
      }
    };

    checkAuth();
  }, []);

  const signIn = async (loginResponse: LoginResponse) => {
    await saveToken(loginResponse.token);
    setUser(loginResponse.user);
    setStatus('authenticated');
  };

  const signOut = async () => {
    await clearToken();
    setUser(null);
    setStatus('unauthenticated');
  };

  return (
    <AuthContext.Provider value={{ status, user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
