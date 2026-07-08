import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getHomeRoute } from "../utils/role";

export const AuthLayout: React.FC = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to={getHomeRoute(user.role, user.module)} replace />;
  return <Outlet />;
};
