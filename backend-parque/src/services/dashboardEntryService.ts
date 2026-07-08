import { prisma } from "../lib/prisma";

export class DashboardEntryService {
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
      start.setHours(0, 0, 0, 0); end = now;
    }

    const vendas = await prisma.venda.findMany({
      where: { modulo: "ENTRADA", data: { gte: start, lte: end } },
      include: {
        pagamento: true,
        usuario: { select: { id: true, nome: true } },
        cupom: true,
        ingressos: { include: { ingresso: true } },
      },
      orderBy: { data: "desc" },
    });

    // ── Faturamento: ONLY APROVADO ────────────────────────────
    const pagamentos: Record<string, number> = {
      PIX: 0, DINHEIRO: 0, CARTAO: 0, CREDITO: 0, DEBITO: 0,
    };
    let total = 0;

    vendas.forEach(v => {
      if (v.pagamento?.status === "APROVADO") {
        total += v.total;
        const m = v.pagamento.metodoPagamento;
        if (m in pagamentos) pagamentos[m] += v.pagamento.valorPago;
      }
    });

    const vendasFormatadas = vendas.map(v => ({
      id: v.id,
      data: v.data,
      total: v.total,
      nomeCliente: v.nomeCliente,
      usuario: v.usuario?.nome ?? null,
      cupomAplicado: v.cupom?.codigo ?? null,
      statusPagamento: v.pagamento?.status ?? null,
      metodoPagamento: v.pagamento?.metodoPagamento ?? null,
      itens: v.ingressos.map(vi => ({
        categoria: vi.ingresso.categoria,
        quantidade: vi.quantidade,
        preco: vi.ingresso.preco,
        subtotal: vi.ingresso.preco * vi.quantidade,
      })),
    }));

    return {
      total,
      quantidadeVendas: vendas.length,
      pagamentos,
      vendas: vendasFormatadas,
    };
  }
}