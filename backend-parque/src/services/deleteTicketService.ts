import { prisma } from "../lib/prisma";

export class DeleteTicketService {
  async execute(id: number) {
    return await prisma.ingresso.update({
      where: { id },
      data: {
        ativo: false
      }
    });
  }
}