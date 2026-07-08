import type { Module, Role } from "../types/auth";

export const getHomeRoute = (_role: Role, module: Module): string => {
  if (module === "ENTRADA") return "/entrada";
  if (module === "LANCHONETE") return "/lanchonete";
  return "/login";
};

export const canAccessRelatorios = (role: Role): boolean => role === "ADMIN";

export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    value,
  );

export const formatDate = (date: string): string =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));

export const formatTime = (date: string): string =>
  new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
