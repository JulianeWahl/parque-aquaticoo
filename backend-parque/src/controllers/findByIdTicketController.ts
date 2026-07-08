import { Request, Response } from "express";
import { FindByIdTicketService } from "../services/findByIdTicketService";

export class FindByIdTicketController {
  async handle(req: Request, res: Response) {
    const service = new FindByIdTicketService();

    const id = Number(req.params.id);

    const result = await service.execute(id);

    return res.json(result);
  }
}