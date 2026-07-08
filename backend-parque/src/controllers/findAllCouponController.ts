import { Request, Response } from "express";
import { FindAllCouponService } from "../services/findAllCouponService";

export class FindAllCouponController {
  async handle(req: Request, res: Response) {
    const service = new FindAllCouponService();

    const result = await service.execute();

    return res.json(result);
  }
}