import api from "./axios";
import type {
  Product,
  Brand,
  Category,
  RestaurantSalePayload,
  KitchenOrder,
  LanchoneteDashboard,
} from "../types/product";

const norm = (p: any): Product => ({
  id: String(p.id),
  _numericId: Number(p.id),
  name: p.nome,
  price: Number(p.preco),
  stock: Number(p.estoque),
  minStock: Number(p.estoqueMinimo),
  needsKitchen: Boolean(p.precisaPreparo),
  isActive: Boolean(p.ativo ?? true),
  category: p.categoria
    ? { id: String(p.categoria.id), name: p.categoria.nome }
    : undefined,
  categoryId: p.categoriaId ? String(p.categoriaId) : undefined,
  brand: p.marca ? { id: String(p.marca.id), name: p.marca.nome } : undefined,
  brandId: p.marcaId ? String(p.marcaId) : undefined,
  createdAt: p.createdAt ?? "",
  updatedAt: p.updatedAt ?? "",
});

export const getProducts = () =>
  api.get<any[]>("/products").then((r) => r.data.map(norm));

export const createProduct = (data: Partial<Product>) =>
  api
    .post<any>("/products", {
      nome: data.name,
      preco: Number(data.price),
      estoque: Number(data.stock ?? 0),
      estoqueMinimo: Number(data.minStock ?? 10),
      precisaPreparo: Boolean(data.needsKitchen ?? false),
      categoriaId: data.categoryId ? Number(data.categoryId) : undefined,
      marcaId: data.brandId ? Number(data.brandId) : undefined,
    })
    .then((r) => norm(r.data));

export const updateProduct = (id: string, data: Partial<Product>) =>
  api
    .patch<any>(`/products/${Number(id)}`, {
      nome: data.name,
      preco: data.price !== undefined ? Number(data.price) : undefined,
      estoque: data.stock !== undefined ? Number(data.stock) : undefined,
      estoqueMinimo:
        data.minStock !== undefined ? Number(data.minStock) : undefined,
      precisaPreparo: data.needsKitchen,
      categoriaId: data.categoryId ? Number(data.categoryId) : undefined,
      marcaId: data.brandId ? Number(data.brandId) : undefined,
    })
    .then((r) => norm(r.data));

export const deleteProduct = (id: string) =>
  api.delete(`/products/${Number(id)}`).then((r) => r.data);

export const getBrands = () =>
  api
    .get<any[]>("/brands")
    .then((r) =>
      r.data.map((b: any): Brand => ({ id: String(b.id), name: b.nome })),
    );

export const createBrand = (nome: string) =>
  api.post<any>("/brands", { nome }).then(
    (r) =>
      ({
        id: String(r.data.id),
        name: r.data.nome,
      }) as Brand,
  );

export const getCategories = () =>
  api
    .get<any[]>("/categories")
    .then((r) =>
      r.data.map((c: any): Category => ({ id: String(c.id), name: c.nome })),
    );

export const restockProduct = (id: string, quantity: number, reason?: string) =>
  api
    .post(`/products/${Number(id)}/restock`, {
      quantidade: Number(quantity),
      motivo: reason ?? "Reposição manual",
    })
    .then((r) => r.data);

export const getKitchenOrders = () =>
  api.get<any[]>("/kitchen/orders").then((r) =>
    r.data.map(
      (o: any): KitchenOrder => ({
        id: String(o.id),
        orderNumber: o.vendaProduto?.venda?.id ?? o.id,
        customerName: o.vendaProduto?.venda?.nomeCliente ?? undefined,
        operador: o.vendaProduto?.venda?.usuario?.nome ?? undefined,
        paymentStatus: o.vendaProduto?.venda?.pagamento?.status ?? undefined,
        status: "PREPARING",
        total: o.vendaProduto?.venda?.total ?? 0,
        paymentMethod:
          o.vendaProduto?.venda?.pagamento?.metodoPagamento ?? "PIX",
        createdAt: o.data ?? "",
        notes: o.observacao ?? o.vendaProduto?.observacao ?? undefined,
        items: [
          {
            id: String(o.id),
            product: { name: o.vendaProduto?.produto?.nome ?? "Produto" },
            quantity: Number(o.quantidade),
            notes: o.observacao ?? o.vendaProduto?.observacao ?? undefined,
          },
        ],
      }),
    ),
  );

export const updateOrderStatus = (id: string, status: string) => {
  const backendStatus =
    status === "DELIVERED"
      ? "ENTREGUE"
      : status === "CANCELLED"
        ? "CANCELADO"
        : "EM_PREPARO";
  return api
    .patch(`/kitchen/orders/${Number(id)}/status`, { status: backendStatus })
    .then((r) => r.data);
};

export const createRestaurantSale = (payload: RestaurantSalePayload) =>
  api
    .post("/restaurant-sales", {
      usuarioId: Number(payload.usuarioId),
      cliente: payload.cliente,
      metodoPagamento: payload.metodoPagamento,
      statusPagamento: payload.statusPagamento,
      cupomCodigo: payload.cupomCodigo,
      itens: payload.itens.map((i) => ({
        produtoId: Number(i.produtoId),
        quantidade: Number(i.quantidade),
        observacao: i.observacao ?? undefined,
      })),
    })
    .then((r) => r.data);

export const getLanchoneteDashboard = (params?: {
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
    .get<LanchoneteDashboard>("/dashboard/restaurant", { params: query })
    .then((r) => r.data);
};

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
