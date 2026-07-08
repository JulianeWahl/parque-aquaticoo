import { prisma } from "../lib/prisma";

export class UpdateProductService {
  async execute(id: number, data: any) {
    return await prisma.produto.update({
      where: { id },
      data
    });
  }
}