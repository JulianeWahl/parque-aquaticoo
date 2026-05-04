import { Request, Response } from "express";
import { UserService } from "../services/userService";

export class UserController {
  async create(req: Request, res: Response) {
    try {
      const { nome, email, senha, roleId } = req.body;

      const service = new UserService();

      const result = await service.create({
        nome,
        email,
        senha,
        roleId
      });

      return res.status(201).json(result);

    } catch (error: any) {
      return res.status(400).json({
        error: error.message
      });
    }
  }
}