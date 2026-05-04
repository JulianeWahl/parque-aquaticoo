import { prisma } from "../lib/prisma";

export class UpdateCouponService {
  async execute(id: number, data: any) {
    return await prisma.cupom.update({
      where: { id },
      data
    });
  }
}