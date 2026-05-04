import { prisma } from "../lib/prisma";

export class FindByIdBrandService {
  async execute(id: number) {
    return await prisma.marcaProduto.findUnique({
      where: { id }
    });
  }
}