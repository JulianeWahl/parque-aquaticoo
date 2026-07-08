import { prisma } from "../lib/prisma";

export class UpdateBrandService {
  async execute(id: number, data: any) {
    return await prisma.marcaProduto.update({
      where: { id },
      data
    });
  }
}