import { Request, Response } from "express";
import { FindAllTicketService } from "../services/findAllTicketService";

export class FindAllTicketController {
  async handle(req: Request, res: Response) {
    const service = new FindAllTicketService();

    const result = await service.execute();

    return res.json(result);
  }
}