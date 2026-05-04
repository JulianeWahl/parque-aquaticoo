import { prisma } from "../lib/prisma";

export class FindAllProductService {
  async execute() {
    return await prisma.produto.findMany({
      include: {
        categoria: true,
        marca: true
      },
      orderBy: {
        id: "desc"
      }
    });
  }
}