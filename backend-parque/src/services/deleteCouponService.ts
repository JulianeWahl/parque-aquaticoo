import { prisma } from "../lib/prisma";

export class DeleteCouponService {
  async execute(id: number) {
    await prisma.cupom.delete({
      where: { id }
    });

    return {
      message: "Cupom removido"
    };
  }
}