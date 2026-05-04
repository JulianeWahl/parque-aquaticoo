import { Request, Response } from "express";
import { UpdateCouponService } from "../services/updateCouponService";

export class UpdateCouponController {
  async handle(req: Request, res: Response) {
    try {
      const service = new UpdateCouponService();

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