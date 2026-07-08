export interface KitchenTicketData {
  pedidoId: number;
  nomeCliente?: string | null;
  itens: Array<{
    nome: string;
    quantidade: number;
    observacao?: string | null;
  }>;
  statusPagamento: string;
  metodoPagamento?: string | null;
  hora: Date;
}

export function formatKitchenTicket(data: KitchenTicketData): string {
  const SEP = "─".repeat(32);
  const hora = data.hora.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const data_ = data.hora.toLocaleDateString("pt-BR");

  const metodoPag = data.metodoPagamento
    ? ((
        {
          PIX: "Pix",
          DINHEIRO: "Dinheiro",
          CREDITO: "Crédito",
          DEBITO: "Débito",
          CARTAO: "Cartão",
        } as any
      )[data.metodoPagamento] ?? data.metodoPagamento)
    : "";

  const lines: string[] = [
    "",
    "  PARQUE AQUÁTICO OLHO D'ÁGUA",
    `       PEDIDO #${data.pedidoId}`,
    SEP,
    `  ${data_}  ${hora}`,
  ];

  if (data.nomeCliente) {
    lines.push(`  Cliente: ${data.nomeCliente}`);
  }

  lines.push(SEP);
  lines.push("  ITENS:");

  for (const item of data.itens) {
    lines.push(`  ${item.quantidade}x ${item.nome}`);
    if (item.observacao) {
      lines.push(`     OBS: ${item.observacao}`);
    }
  }

  lines.push(SEP);
  lines.push(
    `  PGTO: ${metodoPag} — ${data.statusPagamento === "APROVADO" ? "PAGO" : "NÃO PAGO"}`,
  );
  lines.push("");

  return lines.join("\n");
}

export async function printKitchenTicket(
  data: KitchenTicketData,
): Promise<void> {
  const ticket = formatKitchenTicket(data);
  console.log("\n[KITCHEN TICKET]");
  console.log(ticket);
  console.log("[END TICKET]\n");
}
