import { prisma } from "../lib/prisma";

export class FindAllProductService {
  async execute() {
    return await prisma.produto.findMany({
      where: { ativo: true },    // ← CRITICAL: only active products
      include: {
        categoria: true,
        marca: true,
      },
      orderBy: { id: "asc" },   // ← ASC = oldest first (consistent order)
    });
  }
}
