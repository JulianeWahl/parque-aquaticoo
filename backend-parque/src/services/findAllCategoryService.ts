import { prisma } from "../lib/prisma";

export class FindAllCategoryService {
  async execute() {
    return await prisma.categoriaProduto.findMany({
      orderBy: {
        id: "desc"
      }
    });
  }
}