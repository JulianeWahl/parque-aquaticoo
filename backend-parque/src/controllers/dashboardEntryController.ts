import { Request, Response } from "express";
import { DashboardEntryService } from "../services/dashboardEntryService";

export class DashboardEntryController {
  async handle(req: Request, res: Response) {
    const { periodo, startDate, endDate } = req.query;
    const service = new DashboardEntryService();
    const result = await service.execute(
      (periodo as string) ?? "day",
      startDate as string | undefined,
      endDate   as string | undefined
    );
    return res.json(result);
  }
}