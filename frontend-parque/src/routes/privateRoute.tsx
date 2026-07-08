import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Spinner } from "../components/ui/Spinner";
import type { Module, Role } from "../types/auth";

interface Props {
  allowedRoles?: Role[];
  allowedModules?: Module[];
  requireRelatorios?: boolean;
}

export const PrivateRoute: React.FC<Props> = ({
  allowedRoles,
  allowedModules,
  requireRelatorios,
}) => {
  const { user, loading, isAdmin, isFuncionario, canAccessRelatorios } =
    useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-surf-50 flex flex-col items-center justify-center gap-4">
        <Spinner size="lg" />
        <p className="text-slate-500 text-sm animate-pulse-soft">
          Carregando...
        </p>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (requireRelatorios && !canAccessRelatorios) {
    return <Navigate to="/sem-permissao" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/sem-permissao" replace />;
  }

  if (allowedModules && !allowedModules.includes(user.module)) {
    return <Navigate to="/sem-permissao" replace />;
  }

  return <Outlet />;
};
