import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

/*
  Props:
    - children: component to render when allowed
    - roles: optional array of allowed roles
*/
export default function ProtectedRoute({ children, roles }) {
  const auth = useSelector((s) => s.auth);
  const location = useLocation();

  if (!auth?.token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && roles.length > 0) {
    const userRoles = auth.user?.roles || [];
    const allowed = userRoles.some((r) => roles.includes(r));
    if (!allowed) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
}
