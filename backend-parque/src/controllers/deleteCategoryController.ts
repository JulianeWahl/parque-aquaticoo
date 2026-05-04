import { Request, Response } from "express";
import { DeleteCategoryService } from "../services/deleteCategoryService";

export class DeleteCategoryController {
  async handle(req: Request, res: Response) {
    const service = new DeleteCategoryService();

    const id = Number(req.params.id);

    const result = await service.execute(id);

    return res.json(result);
  }
}