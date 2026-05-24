import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const isAuth = true;
  return isAuth ? children : <Navigate to="/login" replace />;
}
export default ProtectedRoute;