import api from "./axios";
import type {
  Ticket,
  TicketSalePayload,
  EntradaDashboard,
} from "../types/ticket";

export const getTickets = (): Promise<Ticket[]> =>
  api.get<any[]>("/tickets").then((r) =>
    r.data.map(
      (t: any): Ticket => ({
        id: String(t.id),
        _numericId: Number(t.id),
        name: t.categoria,
        price: Number(t.preco),
        isActive: Boolean(t.ativo ?? true),
        createdAt: t.createdAt ?? "",
        updatedAt: t.updatedAt ?? "",
      }),
    ),
  );

export const createTicketSale = (payload: TicketSalePayload) =>
  api
    .post("/ticket-sales", {
      usuarioId: Number(payload.usuarioId),
      metodoPagamento: payload.metodoPagamento,
      statusPagamento: payload.statusPagamento,
      cupomCodigo: payload.cupomCodigo,
      cliente: payload.cliente,
      itens: payload.itens.map((i) => ({
        ingressoId: Number(i.ingressoId),
        quantidade: Number(i.quantidade),
      })),
    })
    .then((r) => r.data);

export const validateCoupon = async (codigo: string) => {
  try {
    const { data } = await api.get<any[]>("/coupons");
    const cupom = data.find(
      (c: any) =>
        c.codigo?.toUpperCase() === codigo.toUpperCase() &&
        c.ativo === true &&
        new Date(c.validadeAte) >= new Date(),
    );
    if (!cupom) return null;
    return {
      discount: Number(cupom.desconto),
      discountType: "PERCENT" as const,
      codigo: cupom.codigo,
    };
  } catch {
    return null;
  }
};

export const getEntradaDashboard = (params?: {
  period?: string;
  startDate?: string;
  endDate?: string;
}) => {
  const periodMap: Record<string, string> = {
    daily: "day",
    weekly: "week",
    monthly: "month",
    season: "month",
  };
  const query: Record<string, string> = {};

  if (params?.startDate && params?.endDate) {
    query.startDate = params.startDate;
    query.endDate = params.endDate;
  } else {
    query.periodo = params?.period
      ? (periodMap[params.period] ?? "day")
      : "day";
  }

  return api
    .get<EntradaDashboard>("/dashboard/entrada", { params: query })
    .then((r) => r.data);
};
