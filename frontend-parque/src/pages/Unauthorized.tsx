import React from "react";
import { ShieldOff, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getHomeRoute } from "../utils/role";
import { SYSTEM_NAME } from "../constants/routes";

export const UnauthorizedPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-surf-50 flex items-center justify-center p-6">
      <div className="text-center space-y-5 animate-scale-in">
        <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center justify-center mx-auto">
          <ShieldOff className="w-10 h-10 text-red-400" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900">Acesso Negado</h1>
          <p className="text-ink-400 text-sm mt-2 max-w-xs mx-auto">
            Você não tem permissão para acessar esta página.
          </p>
        </div>
        <button
          onClick={() => user ? navigate(getHomeRoute(user.role, user.module)) : navigate("/login")}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-ink-900 font-semibold rounded-xl text-sm transition-all shadow-lg shadow-blue-600/20"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao início
        </button>
        <p className="text-ink-300 text-xs">{SYSTEM_NAME}</p>
      </div>
    </div>
  );
};
