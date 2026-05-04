import { Request, Response } from "express";
import { FindByIdBrandService } from "../services/findByIdBrandService";

export class FindByIdBrandController {
  async handle(req: Request, res: Response) {
    const service = new FindByIdBrandService();

    const id = Number(req.params.id);

    const result = await service.execute(id);

    return res.json(result);
  }
}