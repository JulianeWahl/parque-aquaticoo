import { Request, Response, NextFunction } from "express";

export function moduleMiddleware(modulo: "ENTRADA" | "LANCHONETE") {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as any;

    if (!user) {
      return res.status(401).json({
        error: "Não autenticado"
      });
    }

    if (user.modulo !== modulo) {
      return res.status(403).json({
        error: "Acesso negado para este módulo"
      });
    }

    next();
  };
}