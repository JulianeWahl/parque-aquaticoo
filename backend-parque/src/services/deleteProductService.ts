import { prisma } from "../lib/prisma";

export class DeleteProductService {
  async execute(id: number) {
    return await prisma.produto.update({
      where: { id },
      data: {
        ativo: false
      }
    });
  }
}