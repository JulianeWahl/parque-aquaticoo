import api from "./axios";
import type { LoginPayload, LoginResponse, MeResponse } from "../types/auth";

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await api.post("/login", {
    email: payload.email,
    senha: payload.password,
  });
  return response.data;
};

export const getMe = async (): Promise<MeResponse> => {
  const response = await api.get("/me");
  return response.data;
};
