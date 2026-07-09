import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { BarChart3, LogOut, Package, ChefHat, Users } from "lucide-react";
import { ROUTES } from "../constants/routes";
import { cn } from "../utils/cn";

export const RestaurantLayout: React.FC = () => {
  const { user, signOut, canAccessRelatorios } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const NavBtn = ({
    path,
    icon,
    label,
  }: {
    path: string;
    icon: React.ReactNode;
    label: string;
  }) => (
    <button
      onClick={() => navigate(path)}
      className={cn("nav-pill nav-pill-orange", isActive(path) && "active")}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );

  return (
    <div
      className="h-screen flex flex-col overflow-hidden"
      style={{ background: "#f5faff" }}
    >
      <header
        className="h-[60px] bg-white border-b border-surf-200 flex items-center justify-between px-5 flex-shrink-0"
        style={{
          boxShadow:
            "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(12,180,230,0.06)",
        }}
      >
        <button
          onClick={() => navigate("/lanchonete")}
          className="flex items-center gap-2.5 group"
        >
          <img
            src="/icon-restaurant.png"
            alt="Lanchonete"
            className="w-10 h-10 rounded-xl object-contain flex-shrink-0 transition-all group-hover:scale-105"
          />
          <div className="text-left">
            <p className="font-display font-bold text-[13px] leading-none">
              <span className="text-ink-900">Parque Aquático </span>
              <span style={{ color: "#f97316" }}>Olho D'Água</span>
            </p>
            <p className="text-ink-400 text-[11px] mt-0.5">
              {user?.role === "ADMIN" ? "Administrador" : "Operador"} ·{" "}
              {user?.name}
            </p>
          </div>
        </button>

        <div className="flex items-center gap-1">
          <NavBtn
            path={ROUTES.LANCHONETE.ESTOQUE}
            icon={<Package className="w-4 h-4" />}
            label="Estoque"
          />
          <NavBtn
            path={ROUTES.LANCHONETE.COZINHA}
            icon={<ChefHat className="w-4 h-4" />}
            label="Cozinha"
          />
          {canAccessRelatorios && (
            <>
              <NavBtn
                path={ROUTES.LANCHONETE.RELATORIOS}
                icon={<BarChart3 className="w-4 h-4" />}
                label="Relatórios"
              />
              <NavBtn
                path="/lanchonete/funcionarios"
                icon={<Users className="w-4 h-4" />}
                label="Funcionários"
              />
            </>
          )}
          <div className="w-px h-5 bg-surf-200 mx-1" />
          <button
            onClick={signOut}
            className="nav-pill text-red-400 hover:!text-red-500 hover:!bg-red-50"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </header>
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
};
