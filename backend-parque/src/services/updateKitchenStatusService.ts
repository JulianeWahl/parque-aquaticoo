import { prisma } from "../lib/prisma";

export class UpdateKitchenStatusService {
  async execute(id: number, status: any) {
    return await prisma.pedidoCozinha.update({
      where: { id },
      data: { status }
    });
  }
}