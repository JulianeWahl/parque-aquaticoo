import { Request, Response } from "express";
import { FindStockHistoryService } from "../services/findStockHistoryService";

export class FindStockHistoryController {
  async handle(req: Request, res: Response) {
    const service = new FindStockHistoryService();

    const result = await service.execute();

    return res.json(result);
  }
}