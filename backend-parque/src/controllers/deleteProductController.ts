import { Request, Response } from "express";
import { DeleteProductService } from "../services/deleteProductService";

export class DeleteProductController {
  async handle(req: Request, res: Response) {
    const service = new DeleteProductService();

    const id = Number(req.params.id);

    const result = await service.execute(id);

    return res.json(result);
  }
}