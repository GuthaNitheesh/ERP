import { useState, useEffect, useCallback } from 'react';
import { ApiClient } from '../api/apiClient';

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

export const useAuth = (apiClient: ApiClient): UseAuthReturn => {
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
  }, [apiClient]);

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
    [apiClient]
  );

  const logout = useCallback(async () => {
    try {
      await apiClient.post('/auth/logout');
      setState({ user: null, loading: false, error: null });
    } catch (error: any) {
      setState((prev) => ({ ...prev, error: error.message }));
    }
  }, [apiClient]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  return {
    ...state,
    login,
    logout,
    refreshUser,
  };
};

