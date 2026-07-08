import { prisma } from "../lib/prisma";

export class RestockProductService {
  async execute(id: number, data: any) {
    const { quantidade, motivo } = data;

    const produto = await prisma.produto.findUnique({
      where: { id }
    });

    if (!produto) {
      throw new Error("Produto não encontrado");
    }

    await prisma.produto.update({
      where: { id },
      data: {
        estoque: produto.estoque + quantidade
      }
    });

    await prisma.reposicao.create({
      data: {
        produtoId: id,
        quantidade,
        motivo
      }
    });

    return {
      message: "Reposição realizada com sucesso"
    };
  }
}