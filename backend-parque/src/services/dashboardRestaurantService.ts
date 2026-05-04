import { prisma } from "../lib/prisma";

export class DashboardRestaurantService {
  async execute(periodo: "day" | "week" | "month") {

    const now = new Date();
    let startDate = new Date();

    if (periodo === "day") startDate.setHours(0,0,0,0);
    if (periodo === "week") startDate.setDate(now.getDate() - 7);
    if (periodo === "month") startDate.setMonth(now.getMonth() - 1);

    const vendas = await prisma.venda.findMany({
      where: {
        modulo: "LANCHONETE",
        data: {
          gte: startDate
        }
      },
      include: {
        pagamento: true,
        produtos: {
          include: {
            pedido: true
          }
        }
      }
    });

    const total = vendas.reduce((acc, v) => acc + v.total, 0);

    let emPreparo = 0;
    let entregues = 0;

    vendas.forEach(v => {
      v.produtos.forEach(p => {
        if (p.pedido?.status === "EM_PREPARO") emPreparo++;
        if (p.pedido?.status === "ENTREGUE") entregues++;
      });
    });

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
      pedidos: {
        emPreparo,
        entregues
      },
      pagamentos
    };
  }
}