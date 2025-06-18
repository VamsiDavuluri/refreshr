import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check for the authentication token in localStorage
  const token = localStorage.getItem('token');

  if (!token) {
    // If no token exists, the user is not authenticated.
    // Redirect them to the main landing page.
    return <Navigate to="/" replace />;
  }

  // If a token exists, the user is authenticated.
  // Render the requested component (e.g., Home, Quiz, etc.).
  return children;
};

export default ProtectedRoute;