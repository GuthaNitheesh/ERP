// src/components/ProtectedRoute.tsx

import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();

  // if not logged in → redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
