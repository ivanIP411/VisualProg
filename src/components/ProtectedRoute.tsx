import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/authContext';

function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const { user, loading } = useAuth();
  const loc = useLocation();

  if (loading) return <div>Загрузка...</div>;
  if (!user) return <Navigate to="/login" state={{ from: loc }} replace />;
  return children;
}
export default ProtectedRoute;
