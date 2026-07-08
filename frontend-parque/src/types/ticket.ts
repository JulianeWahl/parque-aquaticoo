export interface Ticket {
  id: string;
  _numericId?: number;
  name: string;
  price: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartTicketItem {
  ticket: Ticket;
  quantity: number;
}

export type PaymentMethod = "PIX" | "CREDITO" | "DEBITO" | "DINHEIRO";
export type PaymentStatus = "PAGO" | "NAO_PAGO";
export type BackendPaymentStatus = "APROVADO" | "PENDENTE" | "RECUSADO";

export interface TicketSalePayload {
  usuarioId: number;
  metodoPagamento: PaymentMethod;
  statusPagamento: BackendPaymentStatus;
  itens: { ingressoId: number; quantidade: number }[];
  cupomCodigo?: string;
  cliente?: string;
}

export interface VendaItem {
  categoria: string;
  quantidade: number;
  preco: number;
  subtotal: number;
}

export interface VendaEntry {
  id: number;
  data: string;
  total: number;
  nomeCliente: string | null;
  usuario: string | null;
  cupomAplicado: string | null;
  statusPagamento: BackendPaymentStatus | null;
  metodoPagamento: PaymentMethod | null;
  itens: VendaItem[];
}

export interface EntradaDashboard {
  total: number;
  quantidadeVendas: number;
  pagamentos: {
    PIX: number; DINHEIRO: number; CARTAO: number; CREDITO: number; DEBITO: number;
  };
  vendas: VendaEntry[];
}
