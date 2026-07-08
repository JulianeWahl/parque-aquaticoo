import { Request, Response } from "express";
import { UpdateCategoryService } from "../services/updateCategoryService";

export class UpdateCategoryController {
  async handle(req: Request, res: Response) {
    const service = new UpdateCategoryService();

    const id = Number(req.params.id);

    const result = await service.execute(id, req.body);

    return res.json(result);
  }
}