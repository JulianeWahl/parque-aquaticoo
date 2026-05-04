import { prisma } from "../lib/prisma";

export class UpdateTicketService {
  async execute(id: number, data: any) {
    return await prisma.ingresso.update({
      where: { id },
      data
    });
  }
}