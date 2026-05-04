import { Request, Response } from "express";
import { CreateTicketService } from "../services/createTicketService";

export class CreateTicketController {
  async handle(req: Request, res: Response) {
    const service = new CreateTicketService();

    const result = await service.execute(req.body);

    return res.status(201).json(result);
  }
}