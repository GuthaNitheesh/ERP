import React, { createContext, useContext, ReactNode } from 'react';
import { ApiClient, useAuth, User, UseAuthReturn } from '@euroasian/shared-components';

const apiClient = new ApiClient({
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
  const auth = useAuth(apiClient);

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export { apiClient };

