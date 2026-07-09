import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts, validateCoupon } from "../../api/products";
import type { Product, CartProductItem } from "../../types/product";
import { formatCurrency } from "../../utils/role";
import { useToast } from "../../components/ui/Toast";
import { SkeletonProductCard } from "../../components/ui/Skeleton";
import {
  Package,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ChevronRight,
  Tag,
  UtensilsCrossed,
  AlertCircle,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { cn } from "../../utils/cn";

export const RestaurantPOS: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [cart, setCart] = useState<CartProductItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [couponCode, setCouponCode] = useState("");
  const [couponData, setCouponData] = useState<{
    discount: number;
    discountType: "PERCENT";
    codigo: string;
  } | null>(null);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponMsg, setCouponMsg] = useState<{
    text: string;
    ok: boolean;
  } | null>(null);
  const [customerName, setCustomerName] = useState("");

  const loadProducts = useCallback(() => {
    setLoading(true);
    setLoadError(false);
    getProducts()
      .then((data) => {
        setProducts(data.filter((p) => p.isActive !== false));
      })
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);
  useEffect(() => {
    const handleFocus = () => loadProducts();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [loadProducts]);

  const categories = [
    "Todos",
    ...Array.from(
      new Set(
        products.map((p) => p.category?.name).filter(Boolean) as string[],
      ),
    ),
  ];

  const filtered =
    selectedCategory === "Todos"
      ? products
      : products.filter((p) => p.category?.name === selectedCategory);

  const getQty = (id: string) =>
    cart.find((i) => i.product.id === id)?.quantity ?? 0;
  const addToCart = useCallback((product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      const currentQty = existing?.quantity ?? 0;

      if (currentQty >= product.stock) {
        return prev;
      }
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const handleAddToCart = useCallback(
    (product: Product) => {
      const currentQty =
        cart.find((i) => i.product.id === product.id)?.quantity ?? 0;
      if (currentQty >= product.stock && product.stock > 0) {
        toast(
          "warning",
          `Estoque máximo para "${product.name}": ${product.stock} un`,
        );
        return;
      }
      addToCart(product);
    },
    [cart, addToCart, toast],
  );

  const setQty = useCallback(
    (product: Product, qty: number) => {
      if (qty < 0) return;
      if (qty > product.stock) {
        toast("warning", `Quantidade máxima disponível: ${product.stock} un`);
        return;
      }
      setCart((prev) =>
        qty === 0
          ? prev.filter((i) => i.product.id !== product.id)
          : prev.map((i) =>
              i.product.id === product.id ? { ...i, quantity: qty } : i,
            ),
      );
    },
    [toast],
  );

  const subtotal = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const discountValue = couponData ? (subtotal * couponData.discount) / 100 : 0;
  const total = Math.max(0, subtotal - discountValue);
  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
  const hasKitchen = cart.some((i) => i.product.needsKitchen);

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponMsg(null);
    const result = await validateCoupon(couponCode.trim());
    if (result) {
      setCouponData(result);
      setCouponApplied(true);
      setCouponMsg({
        text: `Cupom aplicado: ${result.discount}% de desconto`,
        ok: true,
      });
    } else {
      setCouponData(null);
      setCouponApplied(false);
      setCouponMsg({ text: "Cupom inválido ou expirado.", ok: false });
    }
    setCouponLoading(false);
  };

  const clearCoupon = () => {
    setCouponCode("");
    setCouponData(null);
    setCouponApplied(false);
    setCouponMsg(null);
  };
  const clearCart = () => {
    setCart([]);
    clearCoupon();
    setCustomerName("");
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast("warning", "Adicione produtos ao pedido.");
      return;
    }
    navigate("/lanchonete/pagamento", {
      state: {
        cart,
        subtotal,
        discount: discountValue,
        total,
        coupon: couponApplied ? couponData?.codigo : undefined,
        customerName: customerName.trim() || undefined,
      },
    });
  };

  return (
    <div className="h-full flex overflow-hidden bg-surf-50">
      <div className="flex-1 overflow-y-auto p-5 lg:p-7 no-scrollbar">
        <div className="flex items-center gap-2 flex-wrap mb-5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-semibold transition-all",
                selectedCategory === cat
                  ? "bg-orange-500 text-ink-900 shadow-md shadow-orange-500/30"
                  : "bg-surf-50 border border-surf-200 text-ink-500 hover:border-orange-500/40 hover:text-orange-400",
              )}
            >
              {cat}
            </button>
          ))}
          <button
            onClick={loadProducts}
            className="ml-auto p-2 rounded-xl text-ink-400 hover:text-orange-400 hover:bg-orange-500/10 transition-all"
            title="Recarregar"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <SkeletonProductCard key={i} />
            ))}
          </div>
        )}
        {!loading && loadError && (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
            <AlertTriangle className="w-12 h-12 text-red-400" />
            <p className="text-ink-500 font-medium">
              Erro ao conectar com o servidor
            </p>
            <button
              onClick={loadProducts}
              className="px-5 py-2.5 bg-orange-500 hover:bg-orange-400 text-ink-900 text-sm font-semibold rounded-xl transition-all"
            >
              Tentar novamente
            </button>
          </div>
        )}
        {!loading && !loadError && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
            <div className="w-14 h-14 bg-surf-50 border border-surf-200 rounded-2xl flex items-center justify-center">
              <UtensilsCrossed className="w-6 h-6 text-ink-300" />
            </div>
            <p className="text-ink-500 font-medium">
              Nenhum produto cadastrado
            </p>
            <p className="text-ink-300 text-sm">
              Acesse o{" "}
              <span className="text-orange-400 font-semibold">Estoque</span>{" "}
              para cadastrar produtos
            </p>
          </div>
        )}
        {!loading && !loadError && filtered.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
            {filtered.map((product) => {
              const qty = getQty(product.id);
              const inCart = qty > 0;
              const outOfStock = product.stock === 0;
              const atMax = qty >= product.stock && product.stock > 0;
              const lowStock = product.stock > 0 && product.stock <= 5;
              return (
                <button
                  key={product.id}
                  onClick={() => !outOfStock && handleAddToCart(product)}
                  disabled={outOfStock}
                  className={cn(
                    "relative text-left rounded-2xl p-5 border transition-all duration-200 group",
                    outOfStock
                      ? "opacity-40 cursor-not-allowed border-surf-200/40 bg-white"
                      : inCart
                        ? "border-orange-500/50 bg-orange-500/5 shadow-lg shadow-orange-500/10"
                        : "border-surf-200/60 bg-white hover:border-orange-500/30 hover:shadow-md",
                  )}
                >
                  {inCart && (
                    <div
                      className={cn(
                        "absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center z-10 shadow-md",
                        atMax
                          ? "bg-amber-500 shadow-amber-500/40"
                          : "bg-orange-500 shadow-orange-500/40",
                      )}
                    >
                      <span className="text-ink-900 text-[10px] font-bold">
                        {qty}
                      </span>
                    </div>
                  )}
                  <div
                    className={cn(
                      "w-8 h-8 rounded-xl flex items-center justify-center mb-3 transition-colors",
                      inCart
                        ? "bg-orange-500/20 text-orange-400"
                        : "bg-surf-100 text-ink-400 group-hover:bg-orange-500/10 group-hover:text-orange-400",
                    )}
                  >
                    <UtensilsCrossed className="w-4 h-4" />
                  </div>
                  <p className="text-ink-900 font-bold text-xl leading-snug">
                    {product.name}
                  </p>
                  {product.brand && (
                    <p className="text-orange-400/80 text-sm mt-0.5 font-medium">
                      {product.brand.name}
                    </p>
                  )}
                  {product.category && !product.brand && (
                    <p className="text-ink-300 text-[11px] mt-0.5">
                      {product.category.name}
                    </p>
                  )}
                  <p className="text-orange-400 font-display font-bold text-2xl mt-2">
                    {formatCurrency(product.price)}
                  </p>
                  <div className="flex items-center gap-1 mt-1.5">
                    <Package className="w-3 h-3 text-ink-300 flex-shrink-0" />
                    <span
                      className={cn(
                        "text-sm",
                        outOfStock
                          ? "text-red-400"
                          : atMax
                            ? "text-amber-400"
                            : lowStock
                              ? "text-orange-400"
                              : "text-ink-300",
                      )}
                    >
                      {outOfStock
                        ? "Sem estoque"
                        : atMax
                          ? `Máx. ${product.stock}`
                          : lowStock
                            ? `${product.stock} (baixo)`
                            : `${product.stock} un`}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
        {!loading &&
          !loadError &&
          products.length > 0 &&
          filtered.length === 0 && (
            <p className="text-center text-ink-300 py-12">
              Nenhum produto nesta categoria
            </p>
          )}
        {hasKitchen && (
          <div className="mt-6 max-w-md">
            <h3 className="font-semibold text-ink-600 text-sm mb-2 flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4 text-orange-400" />
              Nome do Cliente{" "}
              <span className="text-ink-300 text-xs font-normal">
                (Opcional — cozinha)
              </span>
            </h3>
            <input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Ex: Juliane"
              className="w-full bg-surf-50 border border-surf-200 rounded-xl px-4 py-2.5 text-sm text-ink-900
                placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500/40 transition-all"
            />
          </div>
        )}
        <div className="mt-6 max-w-md">
          <h3 className="font-semibold text-ink-600 text-sm mb-3 flex items-center gap-2">
            <Tag className="w-4 h-4 text-orange-400" /> Cupom de Desconto
          </h3>
          <div className="flex gap-2">
            <input
              value={couponCode}
              onChange={(e) => {
                setCouponCode(e.target.value.toUpperCase());
                setCouponMsg(null);
              }}
              onKeyDown={(e) =>
                e.key === "Enter" && !couponApplied && applyCoupon()
              }
              placeholder="Código do cupom"
              disabled={couponApplied}
              className="flex-1 bg-surf-50 border border-surf-200 rounded-xl px-4 py-2.5 text-sm text-ink-900
                placeholder-slate-600 font-mono uppercase tracking-wider
                focus:outline-none focus:ring-2 focus:ring-orange-500/40 disabled:opacity-50 transition-all"
            />
            {couponApplied ? (
              <button
                onClick={clearCoupon}
                className="px-4 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl hover:bg-red-500/20 transition-all"
              >
                Remover
              </button>
            ) : (
              <button
                onClick={applyCoupon}
                disabled={!couponCode.trim() || couponLoading}
                className="px-4 py-2.5 bg-orange-500 hover:bg-orange-400 disabled:bg-surf-200 disabled:text-ink-400 text-ink-900 font-semibold text-sm rounded-xl transition-all"
              >
                {couponLoading ? "..." : "Aplicar"}
              </button>
            )}
          </div>
          {couponMsg && (
            <p
              className={`text-xs mt-2 flex items-center gap-1.5 ${couponMsg.ok ? "text-emerald-400" : "text-red-400"}`}
            >
              <AlertCircle className="w-3.5 h-3.5" /> {couponMsg.text}
            </p>
          )}
        </div>
      </div>

      <div className="w-px bg-surf-50 hidden lg:block flex-shrink-0" />
      <div className="w-[360px] flex-shrink-0 flex flex-col bg-white border-l border-surf-200 h-full">
        <div className="px-6 py-5 border-b border-surf-200">
          <h2 className="font-display text-xl font-bold text-ink-900 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-orange-400" />
            Pedido Atual
            {totalItems > 0 && (
              <span className="ml-auto text-xs bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2.5 py-0.5 rounded-full">
                {totalItems} {totalItems === 1 ? "item" : "itens"}
              </span>
            )}
          </h2>
          {customerName && (
            <p className="text-ink-400 text-xs mt-1.5">
              Cliente: <span className="text-ink-600">{customerName}</span>
            </p>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 no-scrollbar">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-3 py-16">
              <div className="w-14 h-14 bg-surf-50 border border-surf-200 rounded-2xl flex items-center justify-center">
                <UtensilsCrossed className="w-6 h-6 text-ink-300" />
              </div>
              <p className="text-ink-400 text-sm">
                Adicione produtos para começar
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {cart.map((item) => {
                const atMax = item.quantity >= item.product.stock;
                return (
                  <div
                    key={item.product.id}
                    className={cn(
                      "flex items-center gap-3 border rounded-xl p-3 transition-all",
                      atMax
                        ? "bg-amber-500/5 border-amber-500/20"
                        : "bg-surf-50/60 border-surf-200/40",
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-ink-900 text-lg font-bold truncate">
                        {item.product.name}
                      </p>
                      <p className="text-ink-400 text-base mt-0.5">
                        {item.quantity}× {formatCurrency(item.product.price)}
                        {atMax && (
                          <span className="text-amber-400 ml-1.5">(máx.)</span>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setQty(item.product, item.quantity - 1)}
                        className="w-6 h-6 rounded-lg bg-surf-200 hover:bg-base-600 flex items-center justify-center text-ink-500 hover:text-ink-900 transition-all"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-ink-900 text-base font-mono font-bold w-7 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          !atMax && setQty(item.product, item.quantity + 1)
                        }
                        disabled={atMax}
                        className="w-6 h-6 rounded-lg bg-surf-200 hover:bg-base-600 flex items-center justify-center text-ink-500 hover:text-ink-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => setQty(item.product, 0)}
                        className="w-6 h-6 rounded-lg text-ink-300 hover:text-red-400 hover:bg-red-500/10 transition-all ml-0.5"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="px-6 py-5 border-t border-surf-200 space-y-3">
          <div className="flex justify-between text-base">
            <span className="text-ink-400">Subtotal</span>
            <span className="text-ink-600">{formatCurrency(subtotal)}</span>
          </div>
          {discountValue > 0 && (
            <div className="flex justify-between text-base">
              <span className="text-emerald-400">
                Desconto ({couponData?.discount}%)
              </span>
              <span className="text-emerald-400">
                −{formatCurrency(discountValue)}
              </span>
            </div>
          )}
          <div className="flex justify-between items-center pt-2 border-t border-surf-200">
            <span className="font-bold text-ink-900">Total</span>
            <span className="font-display text-4xl font-extrabold text-orange-500">
              {formatCurrency(total)}
            </span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="w-full bg-orange-500 hover:bg-orange-400 disabled:bg-surf-200 disabled:text-ink-400
              text-ink-900 font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-orange-500/20
              flex items-center justify-center gap-2 text-base"
          >
            Ir para Pagamento <ChevronRight className="w-4 h-4" />
          </button>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="w-full text-ink-300 hover:text-ink-500 text-sm py-1 transition-colors"
            >
              Limpar Pedido
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
