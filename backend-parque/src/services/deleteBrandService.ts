import { prisma } from "../lib/prisma";

export class DeleteBrandService {
  async execute(id: number) {
    await prisma.marcaProduto.delete({
      where: { id }
    });

    return {
      message: "Marca removida"
    };
  }
}