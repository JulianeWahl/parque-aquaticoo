import { prisma } from "../lib/prisma";

export class FindByIdTicketService {
  async execute(id: number) {
    return await prisma.ingresso.findUnique({
      where: { id }
    });
  }
}