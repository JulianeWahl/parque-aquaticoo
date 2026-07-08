import { prisma } from "../lib/prisma";

export class DashboardRestaurantService {
  async execute(
    periodo: string,
    startDate?: string,
    endDate?: string
  ) {
    const now = new Date();
    let start = new Date();
    let end   = new Date();

    if (startDate && endDate) {
      start = new Date(startDate); start.setHours(0, 0, 0, 0);
      end   = new Date(endDate);   end.setHours(23, 59, 59, 999);
    } else if (periodo === "week") {
      start.setDate(now.getDate() - 7); end = now;
    } else if (periodo === "month") {
      start.setMonth(now.getMonth() - 1); end = now;
    } else {
      // day (default)
      start.setHours(0, 0, 0, 0); end = now;
    }

    const vendas = await prisma.venda.findMany({
      where: { modulo: "LANCHONETE", data: { gte: start, lte: end } },
      include: {
        pagamento: true,
        usuario: { select: { id: true, nome: true } },
        cupom: true,
        produtos: {
          include: {
            produto: true,
            pedido: true,
          },
        },
      },
      orderBy: { data: "desc" },
    });

    // ── Faturamento: ONLY APROVADO ────────────────────────────
    const pagamentos: Record<string, number> = {
      PIX: 0, DINHEIRO: 0, CARTAO: 0, CREDITO: 0, DEBITO: 0,
    };
    let total    = 0;
    let emPreparo = 0;
    let entregues = 0;
    let cancelados = 0;

    vendas.forEach(v => {
      // Only APROVADO counts toward faturamento
      if (v.pagamento?.status === "APROVADO") {
        total += v.total;
        const m = v.pagamento.metodoPagamento;
        if (m in pagamentos) pagamentos[m] += v.pagamento.valorPago;
      }
      // Kitchen counters (independent of payment status)
      v.produtos.forEach(p => {
        if (p.pedido?.status === "EM_PREPARO") emPreparo++;
        if (p.pedido?.status === "ENTREGUE")   entregues++;
        if (p.pedido?.status === "CANCELADO")  cancelados++;
      });
    });

    // ── Venda list (ALL statuses for reporting) ───────────────
    const vendasFormatadas = vendas.map(v => ({
      id: v.id,
      data: v.data,
      total: v.total,
      nomeCliente: v.nomeCliente,
      usuario: v.usuario?.nome ?? null,
      cupomAplicado: v.cupom?.codigo ?? null,
      statusPagamento: v.pagamento?.status ?? null,
      metodoPagamento: v.pagamento?.metodoPagamento ?? null,
      itens: v.produtos.map(vp => ({
        nome: vp.produto.nome,
        quantidade: vp.quantidade,
        preco: vp.produto.preco,
        subtotal: vp.produto.preco * vp.quantidade,
        statusCozinha: vp.pedido?.status ?? null,
      })),
    }));

    return {
      total,                           // only APROVADO
      quantidadeVendas: vendas.length, // all (for order count)
      pedidos: { emPreparo, entregues, cancelados },
      pagamentos,
      vendas: vendasFormatadas,
    };
  }
}