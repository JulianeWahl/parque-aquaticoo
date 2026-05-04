import { prisma } from "../lib/prisma";

export class ApplyCouponRestaurantService {
  async execute(codigo: string, total: number) {
    if (!codigo) {
      return { total, cupomId: null };
    }

    const cupom = await prisma.cupom.findFirst({
      where: {
        codigo,
        ativo: true
      }
    });

    if (!cupom) {
      return { total, cupomId: null };
    }

    const novoTotal = total - (total * cupom.desconto / 100);

    return {
      total: novoTotal,
      cupomId: cupom.id
    };
  }
}