import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getTickets, validateCoupon } from "../../api/tickets";
import type { Ticket, CartTicketItem } from "../../types/ticket";
import { formatCurrency } from "../../utils/role";
import { useToast } from "../../components/ui/Toast";
import { SkeletonTicketCard } from "../../components/ui/Skeleton";
import {
  User,
  Baby,
  Users,
  Plus,
  Minus,
  Tag,
  ShoppingCart,
  Trash2,
  ChevronRight,
  Ticket as TicketIcon,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

const getTicketIcon = (name: string) => {
  const n = name.toLowerCase();

  if (n.includes("adulto")) {
    return <User className="w-16 h-16" />;
  }

  if (n.includes("criança") || n.includes("crianca") || n.includes("6")) {
    return <Baby className="w-16 h-16" />;
  }

  return <Users className="w-16 h-16" />;
};

export const EntryPOS: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [cart, setCart] = useState<CartTicketItem[]>([]);

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

  const loadTickets = useCallback(() => {
    setLoading(true);
    setLoadError(false);

    getTickets()
      .then(setTickets)
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const getQty = (id: string) =>
    cart.find((i) => i.ticket.id === id)?.quantity ?? 0;

  const addOne = useCallback((ticket: Ticket) => {
    setCart((prev) => {
      const exists = prev.find((i) => i.ticket.id === ticket.id);

      if (exists) {
        return prev.map((i) =>
          i.ticket.id === ticket.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }

      return [...prev, { ticket, quantity: 1 }];
    });
  }, []);

  const removeOne = useCallback((ticket: Ticket) => {
    setCart((prev) => {
      const exists = prev.find((i) => i.ticket.id === ticket.id);

      if (!exists) return prev;

      if (exists.quantity === 1) {
        return prev.filter((i) => i.ticket.id !== ticket.id);
      }

      return prev.map((i) =>
        i.ticket.id === ticket.id ? { ...i, quantity: i.quantity - 1 } : i,
      );
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setCart((prev) => prev.filter((i) => i.ticket.id !== id));
  }, []);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.ticket.price * item.quantity,
    0,
  );

  const discountValue = couponData ? (subtotal * couponData.discount) / 100 : 0;

  const total = Math.max(0, subtotal - discountValue);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

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

      setCouponMsg({
        text: "Cupom inválido ou expirado.",
        ok: false,
      });
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
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast("warning", "Adicione ingressos ao carrinho.");
      return;
    }

    navigate("/entrada/pagamento", {
      state: {
        cart,
        subtotal,
        discount: discountValue,
        total,
        coupon: couponApplied ? couponData?.codigo : undefined,
      },
    });
  };

  return (
    <div className="h-full flex overflow-hidden bg-surf-50">
      {/* LEFT */}
      <div className="flex-1 overflow-y-auto p-5 lg:p-7 no-scrollbar">
        <div className="flex justify-end mb-3">
          <button
            onClick={loadTickets}
            className="p-2 rounded-xl text-ink-300 hover:text-aqua-500 hover:bg-aqua-50 transition-all"
            title="Recarregar"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {[0, 1, 2].map((i) => (
              <SkeletonTicketCard key={i} />
            ))}
          </div>
        )}

        {!loading && loadError && (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <AlertCircle className="w-12 h-12 text-red-400" />

            <p className="text-ink-500 font-medium">
              Erro ao conectar com o servidor
            </p>

            <button
              onClick={loadTickets}
              className="px-5 py-2.5 btn-aqua text-sm"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {!loading && !loadError && tickets.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <TicketIcon className="w-12 h-12 text-ink-300" />

            <div>
              <p className="text-ink-500 font-medium">
                Nenhum ingresso cadastrado
              </p>

              <p className="text-ink-300 text-sm mt-1">
                Reinicie o servidor — ingressos são criados automaticamente
              </p>
            </div>

            <button
              onClick={loadTickets}
              className="px-5 py-2.5 rounded-xl border border-surf-300 text-ink-500 text-sm font-semibold hover:border-aqua-300 hover:text-aqua-600 transition-all"
            >
              Verificar novamente
            </button>
          </div>
        )}
        {!loading && !loadError && tickets.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {tickets.map((ticket, idx) => {
              const qty = getQty(ticket.id);

              const inCart = qty > 0;
              const isFree = ticket.price === 0;

              return (
                <div
                  key={ticket.id}
                  onClick={() => addOne(ticket)}
                  style={{
                    animationDelay: `${idx * 70}ms`,
                  }}
                  className={[
                    "relative rounded-3xl p-10 flex flex-col items-center gap-8 border-2",
                    "transition-all duration-200 animate-slide-up cursor-pointer select-none",
                    inCart
                      ? "border-aqua-400 bg-aqua-50 shadow-aqua"
                      : "border-surf-200 bg-white hover:border-aqua-300 hover:shadow-card-hover shadow-card",
                  ].join(" ")}
                >
                  {inCart && (
                    <div
                      className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center shadow-aqua text-white text-sm font-bold"
                      style={{
                        background: "linear-gradient(135deg, #0cb8ed, #0075a3)",
                      }}
                    >
                      {qty}
                    </div>
                  )}
                  <div className={inCart ? "text-aqua-500" : "text-ink-300"}>
                    {getTicketIcon(ticket.name)}
                  </div>
                  <div className="text-center">
                    <p className="text-ink-800 font-extrabold text-[2rem] leading-tight tracking-tight">
                      {ticket.name}
                    </p>

                    <p
                      className={[
                        "font-display font-bold text-[2.4rem] mt-2 tracking-tight",
                        isFree
                          ? "text-emerald-500"
                          : inCart
                            ? "text-aqua-600"
                            : "text-ink-700",
                      ].join(" ")}
                    >
                      {isFree ? "Grátis" : formatCurrency(ticket.price)}
                    </p>
                  </div>
                  <div
                    className="flex items-center gap-5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => removeOne(ticket)}
                      disabled={qty === 0}
                      className="w-14 h-14 rounded-full border-2 border-surf-200 flex items-center justify-center text-ink-400 hover:border-aqua-400 hover:text-aqua-600 disabled:opacity-25 disabled:cursor-not-allowed transition-all"
                    >
                      <Minus className="w-5 h-5" />
                    </button>

                    <span className="w-10 text-center font-display font-bold text-ink-800 text-2xl">
                      {qty}
                    </span>

                    <button
                      onClick={() => addOne(ticket)}
                      className="w-14 h-14 rounded-full text-white flex items-center justify-center transition-all shadow-aqua"
                      style={{
                        background: "linear-gradient(135deg, #0cb8ed, #0075a3)",
                      }}
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div className="mt-8 max-w-md">
          <h3 className="font-semibold text-ink-600 text-sm mb-3 flex items-center gap-2">
            <Tag className="w-4 h-4 text-aqua-400" />
            Cupom de Desconto
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
              className="flex-1 input-field font-mono uppercase tracking-wider disabled:opacity-50"
            />

            {couponApplied ? (
              <button
                onClick={clearCoupon}
                className="px-4 py-2.5 bg-red-50 border border-red-200 text-red-500 text-sm font-semibold rounded-xl hover:bg-red-100 transition-all"
              >
                Remover
              </button>
            ) : (
              <button
                onClick={applyCoupon}
                disabled={!couponCode.trim() || couponLoading}
                className="px-4 py-2.5 btn-aqua text-sm"
              >
                {couponLoading ? "..." : "Aplicar"}
              </button>
            )}
          </div>

          {couponMsg && (
            <p
              className={`text-xs mt-2 flex items-center gap-1.5 ${
                couponMsg.ok ? "text-emerald-600" : "text-red-500"
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              {couponMsg.text}
            </p>
          )}
        </div>
      </div>
      <div className="w-px bg-surf-200 hidden lg:block flex-shrink-0" />
      <div className="w-[380px] flex-shrink-0 flex flex-col bg-white border-l border-surf-200">
        <div className="px-5 py-5 border-b border-surf-100">
          <h2 className="font-display font-bold text-ink-900 text-xl flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-aqua-500" />
            Resumo da Venda
            {totalItems > 0 && (
              <span className="ml-auto text-[11px] font-bold px-2 py-0.5 rounded-full bg-aqua-50 text-aqua-600 border border-aqua-200">
                {totalItems} {totalItems === 1 ? "item" : "itens"}
              </span>
            )}
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 no-scrollbar">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-3 py-12">
              <div className="w-16 h-16 bg-surf-50 border border-surf-200 rounded-2xl flex items-center justify-center">
                <TicketIcon className="w-7 h-7 text-ink-200" />
              </div>

              <p className="text-ink-300 text-sm">
                Clique em um ingresso para adicionar
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.ticket.id}
                  className="flex items-center gap-3 bg-surf-50 border border-surf-200 rounded-2xl p-4"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-ink-800 text-xl font-bold truncate">
                      {item.ticket.name}
                    </p>

                    <p className="text-ink-400 text-base mt-1">
                      {item.quantity}×{" "}
                      {item.ticket.price === 0
                        ? "Grátis"
                        : formatCurrency(item.ticket.price)}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => removeOne(item.ticket)}
                      className="w-8 h-8 rounded-lg bg-surf-100 hover:bg-surf-200 flex items-center justify-center text-ink-400 hover:text-ink-700 transition-all"
                    >
                      <Minus className="w-4 h-4" />
                    </button>

                    <span className="text-ink-800 text-sm font-mono font-bold w-7 text-center">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => addOne(item.ticket)}
                      className="w-8 h-8 rounded-lg bg-surf-100 hover:bg-surf-200 flex items-center justify-center text-ink-400 hover:text-ink-700 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => removeItem(item.ticket.id)}
                      className="w-8 h-8 rounded-lg text-ink-200 hover:text-red-400 hover:bg-red-50 transition-all ml-0.5"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="px-5 py-5 border-t border-surf-100 space-y-3">
          <div className="flex justify-between text-base">
            <span className="text-ink-400">Subtotal</span>

            <span className="text-ink-600 font-medium">
              {formatCurrency(subtotal)}
            </span>
          </div>

          {discountValue > 0 && (
            <div className="flex justify-between text-base">
              <span className="text-emerald-600 font-medium">
                Desconto ({couponData?.discount}%)
              </span>

              <span className="text-emerald-600 font-medium">
                −{formatCurrency(discountValue)}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center pt-3 border-t border-surf-100">
            <span className="font-display font-bold text-ink-900 text-lg">
              Total
            </span>

            <span className="font-display text-[2.5rem] font-extrabold text-aqua-600">
              {formatCurrency(total)}
            </span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="w-full btn-aqua py-4 text-base font-bold flex items-center justify-center gap-2"
          >
            Ir para Pagamento
            <ChevronRight className="w-4 h-4" />
          </button>

          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="w-full text-ink-300 hover:text-ink-500 text-sm py-1 transition-colors"
            >
              Limpar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
