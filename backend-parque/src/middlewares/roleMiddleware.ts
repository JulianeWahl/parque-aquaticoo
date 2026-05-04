import { Response, NextFunction } from "express";

export function roleMiddleware(role: "ADMIN" | "FUNCIONARIO") {
  return (req: any, res: Response, next: NextFunction) => {

    if (!req.user) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    if (req.user.role !== role) {
      return res.status(403).json({ error: "Sem permissão" });
    }

    return next();
  };
}