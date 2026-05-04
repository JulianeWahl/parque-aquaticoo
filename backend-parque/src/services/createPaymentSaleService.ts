import { prisma } from "../lib/prisma";

export class CreatePaymentSaleService {
  async execute(vendaId: number, metodoPagamento: any, total: number) {
    await prisma.pagamento.create({
      data: {
        vendaId,
        metodoPagamento,
        valorPago: total,
        transacaoId: "VENDA-" + Date.now(),
        status: "APROVADO"
      }
    });
  }
}