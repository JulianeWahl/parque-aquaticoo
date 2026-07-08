import React, { createContext, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginApi, getMe } from "../api/auth";
import { getToken, setToken, removeToken } from "../utils/token";
import { getHomeRoute, canAccessRelatorios } from "../utils/role";
import type { AuthContextData, LoginPayload, Module, User } from "../types/auth";

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!token) { setLoading(false); return; }
    getMe()
      .then(({ user }) => setUser(user))
      .catch(() => removeToken())
      .finally(() => setLoading(false));
  }, []);

  const signIn = useCallback(async (payload: LoginPayload) => {
    const { token } = await loginApi(payload);
    setToken(token);
    const { user } = await getMe();
    setUser(user);
    navigate(getHomeRoute(user.role, user.module), { replace: true });
  }, [navigate]);

  const signOut = useCallback(() => {
    removeToken();
    setUser(null);
    navigate("/login", { replace: true });
  }, [navigate]);

  const hasModule = useCallback((mod: Module): boolean => {
    if (!user) return false;
    return user.module === mod;
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signOut,
      isAdmin: user?.role === "ADMIN",
      isFuncionario: user?.role === "FUNCIONARIO",
      canAccessRelatorios: user ? canAccessRelatorios(user.role) : false,
      hasModule,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
