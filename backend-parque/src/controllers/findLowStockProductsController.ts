import { Request, Response } from "express";
import { FindLowStockProductsService } from "../services/findLowStockProductsService";

export class FindLowStockProductsController {
  async handle(req: Request, res: Response) {
    const service = new FindLowStockProductsService();

    const result = await service.execute();

    return res.json(result);
  }
}