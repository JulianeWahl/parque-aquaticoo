import { Request, Response } from "express";
import { UpdateTicketService } from "../services/updateTicketService";

export class UpdateTicketController {
  async handle(req: Request, res: Response) {
    const service = new UpdateTicketService();

    const id = Number(req.params.id);

    const result = await service.execute(id, req.body);

    return res.json(result);
  }
}