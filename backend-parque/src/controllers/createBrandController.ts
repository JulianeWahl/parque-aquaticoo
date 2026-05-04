import { Request, Response } from "express";
import { CreateBrandService } from "../services/createBrandService";

export class CreateBrandController {
  async handle(req: Request, res: Response) {
    try {
      const service = new CreateBrandService();

      const result = await service.execute(req.body);

      return res.status(201).json(result);

    } catch (error: any) {
      return res.status(400).json({
        error: error.message
      });
    }
  }
}