import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user) return <Navigate to="/login" replace />;

  // Role-based access
  if (role && user.role !== role) {
    // if employee tries to access manager route redirect to employee dashboard
    return <Navigate to={user.role === "manager" ? "/manager" : "/dashboard"} replace />;
  }

  return children;
};

export default ProtectedRoute;
