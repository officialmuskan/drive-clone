import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }

    authAPI.getCurrentUser()
      .then(() => setIsAuthenticated(true))
      .catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;