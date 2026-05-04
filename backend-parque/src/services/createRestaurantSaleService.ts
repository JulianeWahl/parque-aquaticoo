import { prisma } from "../lib/prisma";
import { ValidateRestaurantItemsService } from "./validateRestaurantItemsService";
import { ApplyCouponRestaurantService } from "./applyCouponRestaurantService";
import { CreatePaymentSaleService } from "./createPaymentSaleService";

export class CreateRestaurantSaleService {
  async execute(data: any) {
    const {
      cliente,
      usuarioId,
      cupomCodigo,
      metodoPagamento,
      itens
    } = data;

    if (!itens || itens.length === 0) {
      throw new Error("Itens obrigatórios");
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId }
    });

    if (!usuario) {
      throw new Error("Usuário não encontrado");
    }

    // 🔥 valida e calcula total
    const validate = new ValidateRestaurantItemsService();
    let total = await validate.execute(itens);

    // 🎟️ CUPOM
    const coupon = new ApplyCouponRestaurantService();
    const resultCoupon = await coupon.execute(cupomCodigo, total);

    total = resultCoupon.total;

    // 🍔 VENDA COM MÓDULO
    const venda = await prisma.venda.create({
      data: {
        nomeCliente: cliente,
        total,
        usuarioId,
        cupomId: resultCoupon.cupomId,
        modulo: "LANCHONETE" // 👈 ESSENCIAL
      }
    });

    // 🍟 ITENS
    for (const item of itens) {
      const produto = await prisma.produto.findUnique({
        where: { id: item.produtoId }
      });

      if (!produto || !produto.ativo) {
        throw new Error("Produto inválido");
      }

      if (produto.estoque < item.quantidade) {
        throw new Error(`Estoque insuficiente para ${produto.nome}`);
      }

      const vendaProduto = await prisma.vendaProduto.create({
        data: {
          vendaId: venda.id,
          produtoId: item.produtoId,
          quantidade: item.quantidade
        }
      });

      // 📦 baixa estoque
      await prisma.produto.update({
        where: { id: item.produtoId },
        data: {
          estoque: produto.estoque - item.quantidade
        }
      });

      // 👨‍🍳 cozinha
      if (produto.precisaPreparo) {
        await prisma.pedidoCozinha.create({
          data: {
            vendaProdutoId: vendaProduto.id,
            quantidade: item.quantidade,
            status: "EM_PREPARO"
          }
        });
      }
    }

    // 💰 PAGAMENTO
    const payment = new CreatePaymentSaleService();
    await payment.execute(venda.id, metodoPagamento, total);

    return venda;
  }
}