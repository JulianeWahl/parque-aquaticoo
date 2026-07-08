import { Request, Response } from "express";
import { CouponService } from "../services/couponService";

export class CouponController {
  async create(req: Request, res: Response) {
    try {
      const service = new CouponService();

      const result = await service.create(req.body);

      return res.status(201).json(result);

    } catch (error: any) {
      return res.status(400).json({
        error: error.message
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const service = new CouponService();

      const id = Number(req.params.id);

      const result = await service.update(id, req.body);

      return res.json(result);

    } catch (error: any) {
      return res.status(400).json({
        error: error.message
      });
    }
  }
}