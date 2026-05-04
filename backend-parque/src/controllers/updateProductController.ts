import { Request, Response } from "express";
import { UpdateProductService } from "../services/updateProductService";

export class UpdateProductController {
  async handle(req: Request, res: Response) {
    const service = new UpdateProductService();

    const id = Number(req.params.id);

    const result = await service.execute(id, req.body);

    return res.json(result);
  }
}