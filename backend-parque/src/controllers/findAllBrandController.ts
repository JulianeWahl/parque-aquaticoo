import { Request, Response } from "express";
import { FindAllBrandService } from "../services/findAllBrandService";

export class FindAllBrandController {
  async handle(req: Request, res: Response) {
    const service = new FindAllBrandService();

    const result = await service.execute();

    return res.json(result);
  }
}