import { prisma } from "../lib/prisma";

export class CreateProductService {
  async execute(data: any) {
    return await prisma.produto.create({
      data
    });
  }
}