import { Request, Response } from "express";
import { AuthService } from "../services/authService";

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { email, senha } = req.body;

      const service = new AuthService();

      const result = await service.login(email, senha);

      return res.json(result);

    } catch (error: any) {
      return res.status(401).json({
        error: error.message
      });
    }
  }
}