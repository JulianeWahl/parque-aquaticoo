import api from "./axios";

export interface CreateUserPayload {
  nome: string;
  email: string;
  senha: string;
  roleId: number;
}

export const createUser = (payload: CreateUserPayload) =>
  api.post("/usuarios", payload).then(r => r.data);

export interface Role {
  id: number;
  nome: "ADMIN" | "FUNCIONARIO";
  modulo: "ENTRADA" | "LANCHONETE";
}

export const getRoles = (): Promise<Role[]> =>
  api.get<Role[]>("/roles")
    .then(r => r.data)
    .catch(() =>
      Promise.resolve([])
    );
