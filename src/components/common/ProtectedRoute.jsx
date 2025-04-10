import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/admin" />;
};
  
export default ProtectedRoute;
