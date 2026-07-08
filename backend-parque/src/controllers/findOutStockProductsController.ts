import { Request, Response } from "express";
import { FindOutStockProductsService } from "../services/findOutStockProductsService";

export class FindOutStockProductsController {
  async handle(req: Request, res: Response) {
    const service = new FindOutStockProductsService();

    const result = await service.execute();

    return res.json(result);
  }
}