import React from 'react'
import { Navigate,useLocation } from 'react-router-dom';
import { getUser } from '../services/auth';

  function ProtectedRoute({ children, allowedRole }) {
  const user = getUser();
  const location = useLocation();

  
  //if not logged in push to login page
  if (!user) {
    return <Navigate to="/login"state={{ from: location.pathname }}  replace />;
  }

  // If an admin tries to access a standard user route
  if (user.role === "admin" && allowedRole === "user") {
    return <Navigate to="/admin-dashboard" replace />;
  }

  // If a standard user tries to access an admin route
  if (user.role !== "admin" && allowedRole === "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;