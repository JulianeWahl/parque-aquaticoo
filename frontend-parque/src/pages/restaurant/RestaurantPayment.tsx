import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createRestaurantSale } from "../../api/products";
import type {
  CartProductItem,
  PaymentMethod,
  PaymentStatus,
  BackendPaymentStatus,
} from "../../types/product";
import { formatCurrency } from "../../utils/role";
import { useToast } from "../../components/ui/Toast";
import { useAuth } from "../../hooks/useAuth";
import {
  ArrowLeft,
  CheckCircle2,
  Banknote,
  CreditCard,
  QrCode,
  Receipt,
  CheckSquare,
  Clock,
} from "lucide-react";
import { cn } from "../../utils/cn";

interface LocationState {
  cart: CartProductItem[];
  subtotal: number;
  discount: number;
  total: number;
  coupon?: string;
  customerName?: string;
}

const PAYMENT_OPTIONS: {
  method: PaymentMethod;
  label: string;
  icon: React.ReactNode;
}[] = [
  { method: "PIX", label: "Pix", icon: <QrCode className="w-7 h-7" /> },
  {
    method: "CREDITO",
    label: "Crédito",
    icon: <CreditCard className="w-7 h-7" />,
  },
  {
    method: "DEBITO",
    label: "Débito",
    icon: <CreditCard className="w-7 h-7" />,
  },
  {
    method: "DINHEIRO",
    label: "Dinheiro",
    icon: <Banknote className="w-7 h-7" />,
  },
];

const methodLabel = (m: PaymentMethod) =>
  (
    ({
      PIX: "Pix",
      CREDITO: "Crédito",
      DEBITO: "Débito",
      DINHEIRO: "Dinheiro",
    }) as Record<string, string>
  )[m] ?? m;

export const RestaurantPayment: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation() as { state: LocationState };
  const { toast } = useToast();
  const { user } = useAuth();

  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [payStatus, setPayStatus] = useState<PaymentStatus>("PAGO");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [vendaId, setVendaId] = useState<number | null>(null);

  if (!state?.cart) {
    navigate("/lanchonete");
    return null;
  }
  const { cart, subtotal, discount, total, coupon, customerName } = state;

  const toBackend = (s: PaymentStatus): BackendPaymentStatus =>
    s === "PAGO" ? "APROVADO" : "PENDENTE";

  const handleConfirm = async () => {
    if (!method) {
      toast("warning", "Selecione a forma de pagamento.");
      return;
    }
    if (!user?.id) {
      toast("error", "Sessão expirada.");
      return;
    }

    // Validate cart before sending
    const invalidItems = cart.filter(
      (i) => !i.product._numericId && !Number(i.product.id),
    );
    if (invalidItems.length > 0) {
      toast(
        "error",
        `Produto inválido: ${invalidItems.map((i) => i.product.name).join(", ")}`,
      );
      return;
    }

    setLoading(true);
    try {
      const result = await createRestaurantSale({
        usuarioId: Number(user.id),
        cliente: customerName || undefined,
        metodoPagamento: method,
        statusPagamento: toBackend(payStatus),
        cupomCodigo: coupon,
        itens: cart.map((i) => ({
          produtoId: i.product._numericId ?? Number(i.product.id),
          quantidade: i.quantity,
          observacao: i.notes,
        })),
      });
      setVendaId(result?.id ?? null);
      setSuccess(true);
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ??
        err?.response?.data?.message ??
        "Erro ao processar pagamento.";
      toast("error", msg);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="h-full flex items-center justify-center bg-surf-50 p-8">
        <div className="text-center space-y-6 animate-scale-in max-w-sm">
          <div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-12 h-12 text-emerald-400" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-ink-900">
              Pedido Enviado!
            </h2>
            {vendaId && (
              <p className="text-orange-400 font-display font-bold text-xl mt-1">
                Pedido #{vendaId}
              </p>
            )}
            {customerName && (
              <p className="text-ink-500 text-sm mt-0.5">
                Cliente: {customerName}
              </p>
            )}
            <p className="text-ink-400 text-sm mt-2">
              {formatCurrency(total)} · {method && methodLabel(method)}
            </p>
            <p
              className={cn(
                "text-xs mt-1 font-semibold",
                payStatus === "PAGO" ? "text-emerald-400" : "text-amber-400",
              )}
            >
              {payStatus === "PAGO" ? "✓ Pago" : "⏳ Aguardando pagamento"}
            </p>
            <p className="text-ink-400 text-xs mt-1">
              Pedido enviado para a cozinha ✓
            </p>
          </div>
          <button
            onClick={() => navigate("/lanchonete")}
            className="w-full bg-orange-500 hover:bg-orange-400 text-ink-900 font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-orange-500/20"
          >
            Novo Pedido
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-surf-50 p-6 lg:p-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-ink-500 hover:text-ink-900 text-sm mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar
      </button>

      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-ink-900">
            Confirmar Pagamento
          </h1>
          <p className="font-display text-5xl font-bold text-emerald-400 mt-4 tracking-tight">
            {formatCurrency(total)}
          </p>
          {discount > 0 && (
            <p className="text-ink-400 text-sm mt-2">
              Subtotal {formatCurrency(subtotal)} · Desconto −
              {formatCurrency(discount)}
            </p>
          )}
          {customerName && (
            <p className="text-ink-500 text-sm mt-1">
              Cliente:{" "}
              <span className="text-ink-900 font-medium">{customerName}</span>
            </p>
          )}
        </div>

        <div className="bg-white border border-surf-200 rounded-2xl p-4">
          <p className="text-xs text-ink-400 uppercase tracking-widest font-semibold mb-3 flex items-center gap-1.5">
            <Receipt className="w-3.5 h-3.5" /> Itens do Pedido
          </p>
          <div className="space-y-2">
            {cart.map((item) => (
              <div
                key={item.product.id}
                className="flex justify-between text-sm"
              >
                <div>
                  <span className="text-ink-600">
                    {item.quantity}× {item.product.name}
                  </span>
                  {item.notes && (
                    <p className="text-ink-400 text-xs italic mt-0.5">
                      {item.notes}
                    </p>
                  )}
                </div>
                <span className="text-ink-900 font-medium">
                  {formatCurrency(item.product.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs text-ink-400 uppercase tracking-widest font-semibold mb-3">
            Forma de Pagamento
          </p>
          <div className="grid grid-cols-2 gap-3">
            {PAYMENT_OPTIONS.map(({ method: m, label, icon }) => (
              <button
                key={m}
                onClick={() => setMethod(m)}
                className={cn(
                  "flex flex-col items-center gap-2.5 p-4 rounded-2xl border-2 transition-all",
                  method === m
                    ? "border-orange-500 bg-orange-500/10 text-orange-400 shadow-lg shadow-orange-500/15"
                    : "border-surf-200 bg-white text-ink-400 hover:border-surf-300 hover:text-ink-600",
                )}
              >
                {icon}
                <span className="text-xs font-semibold">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs text-ink-400 uppercase tracking-widest font-semibold mb-3">
            Status do Pagamento
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setPayStatus("PAGO")}
              className={cn(
                "flex items-center justify-center gap-2.5 py-3.5 rounded-2xl border-2 transition-all",
                payStatus === "PAGO"
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                  : "border-surf-200 bg-white text-ink-400 hover:border-emerald-500/40 hover:text-emerald-400",
              )}
            >
              <CheckSquare className="w-5 h-5" />
              <span className="text-sm font-bold">Pago</span>
            </button>
            <button
              onClick={() => setPayStatus("NAO_PAGO")}
              className={cn(
                "flex items-center justify-center gap-2.5 py-3.5 rounded-2xl border-2 transition-all",
                payStatus === "NAO_PAGO"
                  ? "border-amber-500 bg-amber-500/10 text-amber-400"
                  : "border-surf-200 bg-white text-ink-400 hover:border-amber-500/40 hover:text-amber-400",
              )}
            >
              <Clock className="w-5 h-5" />
              <span className="text-sm font-bold">Não Pago</span>
            </button>
          </div>
          {payStatus === "NAO_PAGO" && (
            <p className="text-amber-400/70 text-xs mt-2 text-center">
              Pedido registrado como{" "}
              <span className="font-semibold">Pendente</span>
            </p>
          )}
        </div>

        <button
          onClick={handleConfirm}
          disabled={!method || loading}
          className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-surf-200 disabled:text-ink-400
            text-ink-900 font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20
            flex items-center justify-center gap-2 text-base"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
              Processando...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" /> Confirmar Pedido
            </>
          )}
        </button>
      </div>
    </div>
  );
};
