import { prisma } from "../lib/prisma";

export class FindByIdProductService {
  async execute(id: number) {
    return await prisma.produto.findUnique({
      where: {
        id: id
      },
      include: {
        categoria: true,
        marca: true
      }
    });
  }
}