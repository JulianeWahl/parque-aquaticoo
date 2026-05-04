import { Request, Response } from "express";
import { FindByIdProductService } from "../services/findByIdProductService";

export class FindByIdProductController {
  async handle(req: Request, res: Response) {
    const service = new FindByIdProductService();

    const id = Number(req.params.id);

    const result = await service.execute(id);

    return res.json(result);
  }
}