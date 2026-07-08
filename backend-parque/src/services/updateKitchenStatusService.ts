import { prisma } from "../lib/prisma";

export class UpdateKitchenStatusService {
  async execute(id: number, status: "EM_PREPARO" | "ENTREGUE" | "CANCELADO") {
    const pedido = await prisma.pedidoCozinha.findUnique({
      where: { id },
      include: {
        vendaProduto: {
          include: {
            produto: true,
            venda: { include: { pagamento: true } },
          },
        },
      },
    });

    if (!pedido) throw new Error("Pedido não encontrado");

    // Update kitchen status
    const updated = await prisma.pedidoCozinha.update({
      where: { id },
      data: { status },
    });

    if (status === "CANCELADO") {
      // 1. Restore stock with the exact quantity that was sold
      await prisma.produto.update({
        where: { id: pedido.vendaProduto.produto.id },
        data: {
          estoque: pedido.vendaProduto.produto.estoque + pedido.quantidade,
        },
      });

      // 2. Mark payment as RECUSADO so it's excluded from faturamento totals
      const pagamento = pedido.vendaProduto.venda.pagamento;
      if (pagamento && (pagamento.status === "APROVADO" || pagamento.status === "PENDENTE")) {
        await prisma.pagamento.update({
          where: { id: pagamento.id },
          data: { status: "RECUSADO" },
        });
      }
    }

    return updated;
  }
}
