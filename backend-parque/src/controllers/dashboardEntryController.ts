import { Request, Response } from "express";
import { DashboardEntryService } from "../services/dashboardEntryService";

export class DashboardEntryController {
  async handle(req: Request, res: Response) {
    const { periodo } = req.query;

    const service = new DashboardEntryService();

    const result = await service.execute(periodo as any);

    return res.json(result);
  }
}