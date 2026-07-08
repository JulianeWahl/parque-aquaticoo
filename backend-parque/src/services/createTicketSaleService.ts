import { prisma } from "../lib/prisma";

export class CreateTicketSaleService {
  async execute(data: any) {
    const {
      cliente,
      usuarioId,
      cupomCodigo,
      metodoPagamento,
      statusPagamento,  // "APROVADO" | "PENDENTE" — enviado pelo frontend
      itens,
    } = data;

    // ── Validações básicas ──────────────────────────────────────
    if (!itens || itens.length === 0) {
      throw new Error("Itens obrigatórios");
    }

    const userIdNum = Number(usuarioId);
    if (!userIdNum || isNaN(userIdNum)) {
      throw new Error("usuarioId inválido");
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: userIdNum },
    });
    if (!usuario) throw new Error("Usuário não encontrado");

    // ── Calcular total ──────────────────────────────────────────
    let total = 0;
    let cupomId: number | null = null;

    for (const item of itens) {
      const ingressoId = Number(item.ingressoId);
      const quantidade = Number(item.quantidade);

      if (!ingressoId || isNaN(ingressoId)) {
        throw new Error(`ingressoId inválido: ${item.ingressoId}`);
      }
      if (!quantidade || isNaN(quantidade) || quantidade <= 0) {
        throw new Error(`quantidade inválida: ${item.quantidade}`);
      }

      const ingresso = await prisma.ingresso.findUnique({
        where: { id: ingressoId },
      });

      if (!ingresso) {
        throw new Error(`Ingresso não encontrado (id=${ingressoId})`);
      }
      if (!ingresso.ativo) {
        throw new Error(`Ingresso inativo (id=${ingressoId})`);
      }

      total += ingresso.preco * quantidade;
    }

    // ── Cupom ───────────────────────────────────────────────────
    if (cupomCodigo) {
      const cupom = await prisma.cupom.findFirst({
        where: { codigo: cupomCodigo, ativo: true },
      });

      if (cupom) {
        if (cupom.modulo && cupom.modulo !== "ENTRADA") {
          throw new Error("Cupom inválido para este módulo");
        }
        total = total - total * (cupom.desconto / 100);
        cupomId = cupom.id;
      }
    }

    // ── Criar Venda ─────────────────────────────────────────────
    const venda = await prisma.venda.create({
      data: {
        total,
        nomeCliente: cliente ?? null,
        usuarioId: userIdNum,
        cupomId,
        modulo: "ENTRADA",
      },
    });

    // ── Criar VendaIngresso (itens) ─────────────────────────────
    for (const item of itens) {
      await prisma.vendaIngresso.create({
        data: {
          vendaId: venda.id,
          ingressoId: Number(item.ingressoId),
          quantidade: Number(item.quantidade),
        },
      });
    }

    // ── Criar Pagamento ─────────────────────────────────────────
    await prisma.pagamento.create({
      data: {
        vendaId: venda.id,
        metodoPagamento,
        valorPago: total,
        transacaoId: "ENT-" + Date.now(),
        // Usa o status enviado pelo frontend; padrão = APROVADO
        status: statusPagamento ?? "APROVADO",
      },
    });

    return venda;
  }
}