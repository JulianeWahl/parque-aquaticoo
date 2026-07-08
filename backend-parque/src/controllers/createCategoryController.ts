import { Request, Response } from "express";
import { CreateCategoryService } from "../services/createCategoryService";

export class CreateCategoryController {
  async handle(req: Request, res: Response) {
    try {
      const service = new CreateCategoryService();

      const result = await service.execute(req.body);

      return res.status(201).json(result);

    } catch (error: any) {
      return res.status(400).json({
        error: error.message
      });
    }
  }
}