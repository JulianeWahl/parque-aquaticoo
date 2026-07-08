import { Request, Response } from "express";
import { UpdateBrandService } from "../services/updateBrandService";

export class UpdateBrandController {
  async handle(req: Request, res: Response) {
    const service = new UpdateBrandService();

    const id = Number(req.params.id);

    const result = await service.execute(id, req.body);

    return res.json(result);
  }
}