import { Request, Response } from "express";
import { CreateCouponService } from "../services/createCouponService";

export class CreateCouponController {
  async handle(req: Request, res: Response) {
    try {
      const service = new CreateCouponService();

      const result = await service.execute(req.body);

      return res.status(201).json(result);

    } catch (error: any) {
      return res.status(400).json({
        error: error.message
      });
    }
  }
}