import { prisma } from "../lib/prisma";

export class FindKitchenOrdersService {
  async execute() {
    return await prisma.pedidoCozinha.findMany({
      where: {
        status: "EM_PREPARO"
      },
      include: {
        vendaProduto: {
          include: {
            produto: true,
            venda: true
          }
        }
      },
      orderBy: {
        id: "asc"
      }
    });
  }
}