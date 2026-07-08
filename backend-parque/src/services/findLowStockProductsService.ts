import { prisma } from "../lib/prisma";

export class FindLowStockProductsService {
  async execute() {
    const produtos = await prisma.produto.findMany({
      where: {
        ativo: true
      }
    });

    return produtos.filter(
      produto => produto.estoque <= produto.estoqueMinimo
    );
  }
}