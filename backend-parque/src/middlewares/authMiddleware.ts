import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface TokenPayload {
  id: number;
  role: "ADMIN" | "FUNCIONARIO";
  module: "ENTRADA" | "LANCHONETE";
}

export function authMiddleware(
  req: Request & { user?: TokenPayload },
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: "Token não enviado"
    });
  }

  const [, token] = authHeader.split(" ");

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as TokenPayload;

    req.user = decoded;

    return next();
  } catch {
    return res.status(401).json({
      error: "Token inválido"
    });
  }
}