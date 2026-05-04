import { Request, Response } from "express";
import { DeleteTicketService } from "../services/deleteTicketService";

export class DeleteTicketController {
  async handle(req: Request, res: Response) {
    const service = new DeleteTicketService();

    const id = Number(req.params.id);

    const result = await service.execute(id);

    return res.json(result);
  }
}