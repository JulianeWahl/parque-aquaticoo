import { Request, Response } from "express";
import { RestockProductService } from "../services/restockProductService";

export class RestockProductController {
  async handle(req: Request, res: Response) {
    try {
      const service = new RestockProductService();

      const id = Number(req.params.id);

      const result = await service.execute(id, req.body);

      return res.json(result);

    } catch (error: any) {
      return res.status(400).json({
        error: error.message
      });
    }
  }
}