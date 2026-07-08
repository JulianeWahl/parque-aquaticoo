import { Request, Response } from "express";
import { FindAllCategoryService } from "../services/findAllCategoryService";

export class FindAllCategoryController {
  async handle(req: Request, res: Response) {
    const service = new FindAllCategoryService();

    const result = await service.execute();

    return res.json(result);
  }
}