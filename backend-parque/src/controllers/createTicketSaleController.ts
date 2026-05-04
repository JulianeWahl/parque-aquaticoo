import { Request, Response } from "express";
import { CreateTicketSaleService } from "../services/createTicketSaleService";

export class CreateTicketSaleController {
  async handle(req: Request, res: Response) {
    try {
      const service = new CreateTicketSaleService();

      const result = await service.execute(req.body);

      return res.status(201).json(result);

    } catch (error: any) {
      return res.status(400).json({
        error: error.message
      });
    }
  }
}