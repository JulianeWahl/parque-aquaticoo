import { Request, Response } from "express";
import { DeleteBrandService } from "../services/deleteBrandService";

export class DeleteBrandController {
  async handle(req: Request, res: Response) {
    const service = new DeleteBrandService();

    const id = Number(req.params.id);

    const result = await service.execute(id);

    return res.json(result);
  }
}