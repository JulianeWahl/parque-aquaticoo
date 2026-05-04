import { prisma } from "../lib/prisma";

export class FindByIdCouponService {
  async execute(id: number) {
    return await prisma.cupom.findUnique({
      where: { id }
    });
  }
}