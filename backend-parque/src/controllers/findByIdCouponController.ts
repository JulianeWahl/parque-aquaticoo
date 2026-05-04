import { Request, Response } from "express";
import { FindByIdCouponService } from "../services/findByIdCouponService";

export class FindByIdCouponController {
  async handle(req: Request, res: Response) {
    const service = new FindByIdCouponService();

    const id = Number(req.params.id);

    const result = await service.execute(id);

    return res.json(result);
  }
}