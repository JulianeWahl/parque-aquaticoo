import { prisma } from "../lib/prisma";

export class FindAllBrandService {
  async execute() {
    return await prisma.marcaProduto.findMany({
      orderBy: {
        id: "desc"
      }
    });
  }
}