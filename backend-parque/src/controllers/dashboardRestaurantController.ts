import { Request, Response } from "express";
import { DashboardRestaurantService } from "../services/dashboardRestaurantService";

export class DashboardRestaurantController {
  async handle(req: Request, res: Response) {
    const { periodo, startDate, endDate } = req.query;
    const service = new DashboardRestaurantService();
    const result = await service.execute(
      (periodo as string) ?? "day",
      startDate as string | undefined,
      endDate   as string | undefined
    );
    return res.json(result);
  }
}
