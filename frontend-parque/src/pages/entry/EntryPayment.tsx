import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createTicketSale } from "../../api/tickets";
import type {
  CartTicketItem,
  PaymentMethod,
  PaymentStatus,
  BackendPaymentStatus,
} from "../../types/ticket";
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
  User,
} from "lucide-react";
import { cn } from "../../utils/cn";

interface LocationState {
  cart: CartTicketItem[];
  subtotal: number;
  discount: number;
  total: number;
  coupon?: string;
}

const PAYMENT_OPTIONS: {
  method: PaymentMethod;
  label: string;
  icon: React.ReactNode;
  color: string;
}[] = [
  {
    method: "PIX",
    label: "Pix",
    icon: <QrCode className="w-6 h-6" />,
    color: "border-sky-300 bg-sky-50 text-sky-600",
  },
  {
    method: "CREDITO",
    label: "Crédito",
    icon: <CreditCard className="w-6 h-6" />,
    color: "border-violet-300 bg-violet-50 text-violet-600",
  },
  {
    method: "DEBITO",
    label: "Débito",
    icon: <CreditCard className="w-6 h-6" />,
    color: "border-indigo-300 bg-indigo-50 text-indigo-600",
  },
  {
    method: "DINHEIRO",
    label: "Dinheiro",
    icon: <Banknote className="w-6 h-6" />,
    color: "border-emerald-300 bg-emerald-50 text-emerald-600",
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

export const EntryPayment: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation() as { state: LocationState };
  const { toast } = useToast();
  const { user } = useAuth();
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [payStatus, setPayStatus] = useState<PaymentStatus>("PAGO");
  const [clienteName, setClienteName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!state?.cart) {
    navigate("/entrada");
    return null;
  }
  const { cart, subtotal, discount, total, coupon } = state;

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
    setLoading(true);
    try {
      await createTicketSale({
        usuarioId: Number(user.id),
        metodoPagamento: method,
        statusPagamento: toBackend(payStatus),
        cliente: clienteName.trim() || undefined,
        itens: cart.map((i) => ({
          ingressoId: i.ticket._numericId ?? Number(i.ticket.id),
          quantidade: i.quantity,
        })),
        cupomCodigo: coupon,
      });
      setSuccess(true);
    } catch (err: any) {
      toast(
        "error",
        err?.response?.data?.error ??
          err?.response?.data?.message ??
          "Erro ao processar pagamento.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="h-full flex items-center justify-center bg-surf-50 p-8">
        <div className="text-center space-y-5 animate-scale-in max-w-sm">
          <div
            className="w-20 h-20 rounded-3xl mx-auto flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #d1fae5, #a7f3d0)",
              boxShadow: "0 8px 24px rgba(16,185,129,0.2)",
            }}
          >
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-ink-900">
              Venda Confirmada!
            </h2>
            {clienteName && (
              <p className="text-ink-500 text-sm mt-1">
                Cliente: {clienteName}
              </p>
            )}
            <p className="text-ink-500 text-sm mt-1">
              {formatCurrency(total)} · {method && methodLabel(method)}
            </p>
            <p
              className={cn(
                "text-xs mt-1 font-semibold",
                payStatus === "PAGO" ? "text-emerald-600" : "text-amber-600",
              )}
            >
              {payStatus === "PAGO" ? "✓ Pago" : "⏳ Aguardando pagamento"}
            </p>
          </div>
          <button
            onClick={() => navigate("/entrada")}
            className="w-full btn-aqua py-3.5 text-sm"
          >
            Nova Venda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-surf-50 p-6 lg:p-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-ink-400 hover:text-aqua-600 text-sm mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar
      </button>

      <div className="max-w-md mx-auto space-y-5">
        <div className="bg-white rounded-2xl p-6 text-center border border-surf-200 shadow-card">
          <p className="text-ink-400 text-sm font-medium mb-1">Total a pagar</p>
          <p className="font-display text-5xl font-extrabold text-aqua-600 tracking-tight">
            {formatCurrency(total)}
          </p>
          {discount > 0 && (
            <p className="text-ink-400 text-sm mt-2">
              Subtotal {formatCurrency(subtotal)} · Desconto −
              {formatCurrency(discount)}
            </p>
          )}
        </div>
        <div className="bg-white rounded-2xl p-5 border border-surf-200 shadow-card">
          <p className="text-xs text-ink-400 uppercase tracking-widest font-semibold mb-3 flex items-center gap-1.5">
            <Receipt className="w-3.5 h-3.5" /> Ingressos
          </p>
          <div className="space-y-2">
            {cart.map((item) => (
              <div
                key={item.ticket.id}
                className="flex justify-between text-sm"
              >
                <span className="text-ink-600">
                  {item.quantity}× {item.ticket.name}
                </span>
                <span className="text-ink-800 font-semibold">
                  {item.ticket.price === 0
                    ? "Grátis"
                    : formatCurrency(item.ticket.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs text-ink-400 uppercase tracking-widest font-semibold mb-2 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" /> Nome do Cliente{" "}
            <span className="text-ink-300 font-normal normal-case">
              (Opcional)
            </span>
          </p>
          <input
            value={clienteName}
            onChange={(e) => setClienteName(e.target.value)}
            placeholder="Ex: João Silva"
            className="input-field"
          />
        </div>
        <div>
          <p className="text-xs text-ink-400 uppercase tracking-widest font-semibold mb-3">
            Forma de Pagamento
          </p>
          <div className="grid grid-cols-2 gap-3">
            {PAYMENT_OPTIONS.map(({ method: m, label, icon, color }) => (
              <button
                key={m}
                onClick={() => setMethod(m)}
                className={cn(
                  "flex flex-col items-center gap-2.5 p-4 rounded-xl border-2 transition-all duration-150 bg-white",
                  method === m
                    ? color + " shadow-card"
                    : "border-surf-200 text-ink-400 hover:border-surf-300",
                )}
              >
                {icon}
                <span className="text-sm font-bold">{label}</span>
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
                "flex items-center justify-center gap-2.5 py-3.5 rounded-xl border-2 transition-all",
                payStatus === "PAGO"
                  ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                  : "border-surf-200 bg-white text-ink-400 hover:border-emerald-200",
              )}
            >
              <CheckSquare className="w-5 h-5" />
              <span className="text-sm font-bold">Pago</span>
            </button>
            <button
              onClick={() => setPayStatus("NAO_PAGO")}
              className={cn(
                "flex items-center justify-center gap-2.5 py-3.5 rounded-xl border-2 transition-all",
                payStatus === "NAO_PAGO"
                  ? "border-amber-400 bg-amber-50 text-amber-700"
                  : "border-surf-200 bg-white text-ink-400 hover:border-amber-200",
              )}
            >
              <Clock className="w-5 h-5" />
              <span className="text-sm font-bold">Não Pago</span>
            </button>
          </div>
        </div>

        <button
          onClick={handleConfirm}
          disabled={!method || loading}
          className="w-full btn-aqua py-4 text-base flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
              Processando...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" /> Confirmar Venda
            </>
          )}
        </button>
      </div>
    </div>
  );
};
