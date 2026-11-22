import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, currentUser, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // Redirect to patient dashboard if not authorized for admin
    if (currentUser.role === 'PATIENT') return <Navigate to="/dashboard" replace />;
    
    // Fallback
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
