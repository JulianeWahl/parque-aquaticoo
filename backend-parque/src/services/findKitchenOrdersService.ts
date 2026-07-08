// FILE: src/services/findKitchenOrdersService.ts
// Includes pagamento + usuario so KitchenPanel can show payment status and operator.

import { prisma } from "../lib/prisma";

export class FindKitchenOrdersService {
  async execute() {
    return await prisma.pedidoCozinha.findMany({
      where: { status: "EM_PREPARO" },
      include: {
        vendaProduto: {
          include: {
            produto: true,
            venda: {
              include: {
                pagamento: true,
                usuario: { select: { id: true, nome: true } },
              },
            },
          },
        },
      },
      orderBy: { id: "asc" },
    });
  }
}
