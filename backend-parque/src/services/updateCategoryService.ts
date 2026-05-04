import { prisma } from "../lib/prisma";

export class UpdateCategoryService {
  async execute(id: number, data: any) {
    return await prisma.categoriaProduto.update({
      where: { id },
      data
    });
  }
}