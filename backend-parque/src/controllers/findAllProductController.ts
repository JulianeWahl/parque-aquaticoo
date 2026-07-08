import { Request, Response } from "express";
import { FindAllProductService } from "../services/findAllProductService";

export class FindAllProductController {
  async handle(req: Request, res: Response) {
    const service = new FindAllProductService();

    const result = await service.execute();

    return res.json(result);
  }
}