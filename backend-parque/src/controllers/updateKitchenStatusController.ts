import { Request, Response } from "express";
import { UpdateKitchenStatusService } from "../services/updateKitchenStatusService";

export class UpdateKitchenStatusController {
  async handle(req: Request, res: Response) {
    const service = new UpdateKitchenStatusService();

    const id = Number(req.params.id);

    const result = await service.execute(id, req.body.status);

    return res.json(result);
  }
}