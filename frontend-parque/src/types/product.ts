export interface Brand {
  id: string;
  name: string;
}
export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  _numericId?: number;
  name: string;
  price: number;
  stock: number;
  minStock: number;
  needsKitchen?: boolean;
  isActive: boolean;
  category?: Category;
  categoryId?: string;
  brand?: Brand;
  brandId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartProductItem {
  product: Product;
  quantity: number;
  notes?: string;
}

export type PaymentMethod = "PIX" | "CREDITO" | "DEBITO" | "DINHEIRO";
export type PaymentStatus = "PAGO" | "NAO_PAGO";
export type BackendPaymentStatus = "APROVADO" | "PENDENTE" | "RECUSADO";
export type KitchenStatus = "PREPARING" | "DELIVERED" | "CANCELLED";
export type BackendKitchenStatus = "EM_PREPARO" | "ENTREGUE" | "CANCELADO";

export interface RestaurantSalePayload {
  usuarioId: number;
  cliente?: string;
  metodoPagamento: PaymentMethod;
  statusPagamento: BackendPaymentStatus;
  cupomCodigo?: string;
  itens: {
    produtoId: number;
    quantidade: number;
    observacao?: string;
  }[];
}

export interface KitchenOrder {
  id: string;
  orderNumber: number;
  customerName?: string;
  operador?: string;
  status: KitchenStatus;
  paymentStatus?: BackendPaymentStatus;
  items: KitchenOrderItem[];
  total: number;
  paymentMethod: PaymentMethod;
  notes?: string;
  createdAt: string;
}

export interface KitchenOrderItem {
  id: string;
  product: { name: string };
  quantity: number;
  notes?: string;
}

export interface VendaItemLanch {
  nome: string;
  quantidade: number;
  preco: number;
  subtotal: number;
  statusCozinha: string | null;
}

export interface VendaEntryLanch {
  id: number;
  data: string;
  total: number;
  nomeCliente: string | null;
  usuario: string | null;
  cupomAplicado: string | null;
  statusPagamento: BackendPaymentStatus | null;
  metodoPagamento: PaymentMethod | null;
  itens: VendaItemLanch[];
}

export interface LanchoneteDashboard {
  total: number;
  quantidadeVendas: number;
  pedidos: { emPreparo: number; entregues: number; cancelados: number };
  pagamentos: {
    PIX: number;
    DINHEIRO: number;
    CARTAO: number;
    CREDITO: number;
    DEBITO: number;
  };
  vendas: VendaEntryLanch[];
}

const NO_ALERT = ["combo", "lanche", "porção", "porcao", "salgado"];
export const shouldShowStockAlert = (p: Product): boolean => {
  if (p.needsKitchen) return false;
  return !NO_ALERT.some((k) =>
    (p.category?.name ?? "").toLowerCase().includes(k),
  );
};
