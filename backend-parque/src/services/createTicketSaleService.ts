import { prisma } from "../lib/prisma";

export class CreateTicketSaleService {
  async execute(data: any) {
    const {
      cliente,
      usuarioId,
      cupomCodigo,
      metodoPagamento,
      itens
    } = data;

    let total = 0;
    let cupomId = null;

    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId }
    });

    if (!usuario) {
      throw new Error("Usuário não encontrado");
    }

    if (!itens || itens.length === 0) {
      throw new Error("Itens obrigatórios");
    }

    // 🔥 calcula total
    for (const item of itens) {
      const ingresso = await prisma.ingresso.findUnique({
        where: { id: item.ingressoId }
      });

      if (!ingresso || !ingresso.ativo) {
        throw new Error("Ingresso inválido");
      }

      total += ingresso.preco * item.quantidade;
    }

    // 🎟️ CUPOM (VALIDANDO MÓDULO)
    if (cupomCodigo) {
      const cupom = await prisma.cupom.findFirst({
        where: {
          codigo: cupomCodigo,
          ativo: true
        }
      });

      if (cupom) {
        // 🔥 valida se cupom é da entrada
        if (cupom.modulo && cupom.modulo !== "ENTRADA") {
          throw new Error("Cupom inválido para ingressos");
        }

        total -= total * (cupom.desconto / 100);
        cupomId = cupom.id;
      }
    }

    // 🎯 VENDA COM MÓDULO
    const venda = await prisma.venda.create({
      data: {
        total,
        nomeCliente: cliente,
        usuarioId,
        cupomId,
        modulo: "ENTRADA" // 👈 ESSENCIAL
      }
    });

    // 🎟️ RELAÇÃO
    for (const item of itens) {
      await prisma.vendaIngresso.create({
        data: {
          vendaId: venda.id,
          ingressoId: item.ingressoId,
          quantidade: item.quantidade
        }
      });
    }

    // 💰 PAGAMENTO
    await prisma.pagamento.create({
      data: {
        vendaId: venda.id,
        metodoPagamento,
        valorPago: total,
        transacaoId: "TEMP-" + Date.now(),
        status: "APROVADO"
      }
    });

    return venda;
  }
}