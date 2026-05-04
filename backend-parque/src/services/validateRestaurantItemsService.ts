import { prisma } from "../lib/prisma";

export class ValidateRestaurantItemsService {
  async execute(itens: any[]) {
    let total = 0;

    for (const item of itens) {
      const produto = await prisma.produto.findUnique({
        where: { id: item.produtoId }
      });

      if (!produto || !produto.ativo) {
        throw new Error("Produto inválido");
      }

      if (produto.estoque < item.quantidade) {
        throw new Error(`Estoque insuficiente para ${produto.nome}`);
      }

      total += produto.preco * item.quantidade;
    }

    return total;
  }
}