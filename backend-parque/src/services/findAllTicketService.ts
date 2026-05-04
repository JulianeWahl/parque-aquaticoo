import { prisma } from "../lib/prisma";

export class FindAllTicketService {
  async execute() {
    return await prisma.ingresso.findMany({
      orderBy: {
        id: "desc"
      }
    });
  }
}