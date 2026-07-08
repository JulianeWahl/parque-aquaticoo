import { prisma } from "../lib/prisma";

export class CouponService {
  async create(data: any) {
    const { codigo, desconto, validadeAte } = data;

    const exists = await prisma.cupom.findUnique({
      where: { codigo }
    });

    if (exists) {
      throw new Error("Cupom já existe");
    }

    const coupon = await prisma.cupom.create({
      data: {
        codigo,
        desconto,
        validadeAte: new Date(validadeAte),
        ativo: true
      }
    });

    return coupon;
  }

  async update(id: number, data: any) {
    const coupon = await prisma.cupom.update({
      where: { id },
      data
    });

    return coupon;
  }
}