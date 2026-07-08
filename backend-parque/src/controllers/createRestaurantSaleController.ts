import { Request, Response } from "express";
import { CreateRestaurantSaleService } from "../services/createRestaurantSaleService";

export class CreateRestaurantSaleController {
  async handle(req: Request, res: Response) {
    try {
      const service = new CreateRestaurantSaleService();

      const result = await service.execute(req.body);

      return res.status(201).json(result);

    } catch (error: any) {
      return res.status(400).json({
        error: error.message
      });
    }
  }
}