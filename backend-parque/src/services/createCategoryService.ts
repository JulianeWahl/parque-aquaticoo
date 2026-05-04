import { prisma } from "../lib/prisma";

export class CreateCategoryService {
  async execute(data: any) {
    const { nome } = data;

    return await prisma.categoriaProduto.create({
      data: { nome }
    });
  }
}