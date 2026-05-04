import { Request, Response } from "express";
import { FindKitchenOrdersService } from "../services/findKitchenOrdersService";

export class FindKitchenOrdersController {
  async handle(req: Request, res: Response) {
    const service = new FindKitchenOrdersService();

    const result = await service.execute();

    return res.json(result);
  }
}