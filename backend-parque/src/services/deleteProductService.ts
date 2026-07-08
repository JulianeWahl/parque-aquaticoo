import { prisma } from "../lib/prisma";

export class DeleteProductService {
  async execute(id: number) {
    const produto = await prisma.produto.findUnique({ where: { id } });
    if (!produto) throw new Error("Produto não encontrado");
    if (!produto.ativo) throw new Error("Produto já foi removido");

    return await prisma.produto.update({
      where: { id },
      data: { ativo: false },
    });
  }
}
