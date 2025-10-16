import React, { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  globalRole: string;
  tenantId?: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface UseAuthReturn extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const apiClient = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
});

const AuthContext = createContext<UseAuthReturn | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  const refreshUser = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const response = await apiClient.get<{ data: { user: User } }>('/auth/me');
      setState({ user: response.data.user, loading: false, error: null });
    } catch (error: any) {
      setState({ user: null, loading: false, error: error.message });
    }
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const response = await apiClient.post<{ data: { user: User } }>('/auth/login', {
          email,
          password,
        });
        setState({ user: response.data.user, loading: false, error: null });
      } catch (error: any) {
        setState({ user: null, loading: false, error: error.message });
        throw error;
      }
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await apiClient.post('/auth/logout');
      setState({ user: null, loading: false, error: null });
    } catch (error: any) {
      setState((prev) => ({ ...prev, error: error.message }));
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const auth: UseAuthReturn = {
    ...state,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export { apiClient };

