import { Request, Response } from "express";
import { DashboardRestaurantService } from "../services/dashboardRestaurantService";

export class DashboardRestaurantController {
  async handle(req: Request, res: Response) {
    const { periodo } = req.query;

    const service = new DashboardRestaurantService();

    const result = await service.execute(periodo as any);

    return res.json(result);
  }
}