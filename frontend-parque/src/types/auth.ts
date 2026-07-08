export type Role = "ADMIN" | "FUNCIONARIO";
export type Module = "ENTRADA" | "LANCHONETE";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  module: Module;
}

export interface MeResponse {
  user: User;
}

export interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (payload: LoginPayload) => Promise<void>;
  signOut: () => void;
  isAdmin: boolean;
  isFuncionario: boolean;
  canAccessRelatorios: boolean;
  hasModule: (mod: Module) => boolean;
}
