import { prisma } from "../lib/prisma";

export class DeleteCategoryService {
  async execute(id: number) {
    await prisma.categoriaProduto.delete({
      where: { id }
    });

    return { message: "Categoria removida" };
  }
}