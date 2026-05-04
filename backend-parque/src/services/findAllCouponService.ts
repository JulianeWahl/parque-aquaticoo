import { prisma } from "../lib/prisma";

export class FindAllCouponService {
  async execute() {
    return await prisma.cupom.findMany({
      orderBy: {
        id: "desc"
      }
    });
  }
}