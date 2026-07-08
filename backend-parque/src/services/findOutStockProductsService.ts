import { prisma } from "../lib/prisma";

export class FindOutStockProductsService {
  async execute() {
    return await prisma.produto.findMany({
      where: {
        ativo: true,
        estoque: 0
      }
    });
  }
}