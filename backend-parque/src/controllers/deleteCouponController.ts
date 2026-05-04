import { Request, Response } from "express";
import { DeleteCouponService } from "../services/deleteCouponService";

export class DeleteCouponController {
  async handle(req: Request, res: Response) {
    const service = new DeleteCouponService();

    const id = Number(req.params.id);

    const result = await service.execute(id);

    return res.json(result);
  }
}