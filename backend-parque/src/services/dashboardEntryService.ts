import { prisma } from "../lib/prisma";

export class DashboardEntryService {
  async execute(periodo: "day" | "week" | "month") {

    const now = new Date();
    let startDate = new Date();

    if (periodo === "day") {
      startDate.setHours(0, 0, 0, 0);
    }

    if (periodo === "week") {
      startDate.setDate(now.getDate() - 7);
    }

    if (periodo === "month") {
      startDate.setMonth(now.getMonth() - 1);
    }

    const vendas = await prisma.venda.findMany({
      where: {
        modulo: "ENTRADA",
        data: {
          gte: startDate
        }
      },
      include: {
        pagamento: true
      }
    });

    const total = vendas.reduce((acc, v) => acc + v.total, 0);

    const pagamentos = {
      PIX: 0,
      DINHEIRO: 0,
      CARTAO: 0,
      CREDITO: 0,
      DEBITO: 0
    };

    vendas.forEach(v => {
      if (v.pagamento) {
        pagamentos[v.pagamento.metodoPagamento] += v.pagamento.valorPago;
      }
    });

    return {
      total,
      quantidadeVendas: vendas.length,
      pagamentos
    };
  }
}