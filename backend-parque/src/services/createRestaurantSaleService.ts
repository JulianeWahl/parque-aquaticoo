import { prisma } from "../lib/prisma";
import { ApplyCouponRestaurantService } from "./applyCouponRestaurantService";
import { CreatePaymentSaleService } from "./createPaymentSaleService";
import { printKitchenTicket } from "../utils/kitchenTicket";

export class CreateRestaurantSaleService {
  async execute(data: any) {
    const {
      cliente,
      usuarioId,
      cupomCodigo,
      metodoPagamento,
      statusPagamento,
      itens,
    } = data;

    if (!itens || itens.length === 0) throw new Error("Itens obrigatórios");

    const userIdNum = Number(usuarioId);
    if (!userIdNum || isNaN(userIdNum)) throw new Error("usuarioId inválido");

    const usuario = await prisma.usuario.findUnique({ where: { id: userIdNum } });
    if (!usuario) throw new Error("Usuário não encontrado");

    // ── Validate items + compute total ────────────────────────
    let total = 0;
    for (const item of itens) {
      const produtoId = Number(item.produtoId);
      const quantidade = Number(item.quantidade);

      if (!produtoId || isNaN(produtoId)) throw new Error(`produtoId inválido: ${item.produtoId}`);
      if (!quantidade || isNaN(quantidade) || quantidade <= 0) throw new Error(`quantidade inválida`);

      const produto = await prisma.produto.findUnique({ where: { id: produtoId } });
      if (!produto || !produto.ativo) throw new Error(`Produto inválido (id=${produtoId})`);
      if (produto.estoque < quantidade) {
        throw new Error(`Estoque insuficiente para "${produto.nome}": disponível ${produto.estoque}, solicitado ${quantidade}`);
      }
      total += produto.preco * quantidade;
    }

    // ── Coupon ────────────────────────────────────────────────
    const couponSvc = new ApplyCouponRestaurantService();
    const resultCoupon = await couponSvc.execute(cupomCodigo, total);
    total = resultCoupon.total;

    // ── Venda ─────────────────────────────────────────────────
    const venda = await prisma.venda.create({
      data: {
        nomeCliente: cliente ?? null,
        total,
        usuarioId: userIdNum,
        cupomId: resultCoupon.cupomId,
        modulo: "LANCHONETE",
      },
    });

    // ── Collect kitchen items for ticket generation ───────────
    const kitchenItems: Array<{ nome: string; quantidade: number; observacao?: string | null }> = [];

    // ── Items + stock deduction + kitchen orders ──────────────
    for (const item of itens) {
      const produtoId = Number(item.produtoId);
      const quantidade = Number(item.quantidade);
      const observacao = item.observacao ?? null;

      const produto = await prisma.produto.findUnique({ where: { id: produtoId } });
      if (!produto) throw new Error(`Produto ${produtoId} não encontrado`);

      const vendaProduto = await prisma.vendaProduto.create({
        data: {
          vendaId: venda.id,
          produtoId,
          quantidade,
          // observacao requires migration: add "observacao String?" to VendaProduto in schema
          // If migration not yet applied, comment out the line below:
          ...(observacao !== null ? { observacao } : {}),
        },
      });

      // Deduct stock
      await prisma.produto.update({
        where: { id: produtoId },
        data: { estoque: produto.estoque - quantidade },
      });

      // Only products with precisaPreparo go to kitchen
      if (produto.precisaPreparo) {
        await prisma.pedidoCozinha.create({
          data: {
            vendaProdutoId: vendaProduto.id,
            quantidade,
            status: "EM_PREPARO",
            // If migration applied:
            ...(observacao !== null ? { observacao } : {}),
          },
        });

        kitchenItems.push({ nome: produto.nome, quantidade, observacao });
      }
    }

    // ── Payment ───────────────────────────────────────────────
    const paymentSvc = new CreatePaymentSaleService();
    await paymentSvc.execute(venda.id, metodoPagamento, total, statusPagamento);

    // ── Generate + print kitchen ticket (non-blocking) ────────
    // Only print if there are items that need kitchen preparation
    if (kitchenItems.length > 0) {
      printKitchenTicket({
        pedidoId: venda.id,
        nomeCliente: cliente ?? null,
        itens: kitchenItems,
        statusPagamento: statusPagamento ?? "APROVADO",
        metodoPagamento,
        hora: new Date(),
      }).catch(err => {
        // Never fail the sale due to printer error
        console.error("[KITCHEN TICKET ERROR]", err);
      });
    }

    return venda;
  }
}