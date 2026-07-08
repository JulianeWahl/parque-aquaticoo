import { prisma } from "../lib/prisma";

export class CreateCouponService {
  async execute(data: any) {
    const { codigo, desconto, validadeAte } = data;

    const exists = await prisma.cupom.findUnique({
      where: { codigo }
    });

    if (exists) {
      throw new Error("Cupom já existe");
    }

    return await prisma.cupom.create({
      data: {
        codigo,
        desconto,
        validadeAte: new Date(validadeAte),
        ativo: true
      }
    });
  }
}