declare namespace Express {
  export interface Request {
    user?: {
      id: number;
      role: "ADMIN" | "FUNCIONARIO";
      module: "ENTRADA" | "LANCHONETE";
    };
  }
}