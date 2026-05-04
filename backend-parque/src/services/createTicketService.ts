import { prisma } from "../lib/prisma";

export class CreateTicketService {
  async execute(data: any) {
    const { categoria, preco } = data;

    return await prisma.ingresso.create({
      data: {
        categoria,
        preco,
        ativo: true
      }
    });
  }
}