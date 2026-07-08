import { prisma } from "../lib/prisma";

export class FindAllTicketService {
  async execute() {
    // Retorna apenas ingressos ativos, ordenados por id ASC
    return await prisma.ingresso.findMany({
      where: { ativo: true },
      orderBy: { id: "asc" },
    });
  }
}
