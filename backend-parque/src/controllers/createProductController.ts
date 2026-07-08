import { Request, Response } from "express";
import { CreateProductService } from "../services/createProductService";

export class CreateProductController {
  async handle(req: Request, res: Response) {
    try {
      const service = new CreateProductService();

      const result = await service.execute(req.body);

      return res.status(201).json(result);

    } catch (error: any) {
      return res.status(400).json({
        error: error.message
      });
    }
  }
}