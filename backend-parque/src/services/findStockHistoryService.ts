import { prisma } from "../lib/prisma";

export class FindStockHistoryService {
  async execute() {
    return await prisma.reposicao.findMany({
      include: {
        produto: true
      },
      orderBy: {
        data: "desc"
      }
    });
  }
}