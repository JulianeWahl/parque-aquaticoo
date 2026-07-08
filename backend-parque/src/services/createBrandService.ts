import { prisma } from "../lib/prisma";

export class CreateBrandService {
  async execute(data: any) {
    const { nome } = data;

    return await prisma.marcaProduto.create({
      data: { nome }
    });
  }
}