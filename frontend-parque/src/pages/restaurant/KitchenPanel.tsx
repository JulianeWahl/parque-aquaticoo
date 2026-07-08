import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getKitchenOrders, updateOrderStatus } from "../../api/products";
import type { KitchenOrder } from "../../types/product";
import { useToast } from "../../components/ui/Toast";
import { Spinner } from "../../components/ui/Spinner";
import { formatCurrency, formatTime } from "../../utils/role";
import {
  ArrowLeft,
  ChefHat,
  CheckCircle2,
  Clock,
  RefreshCw,
  User,
  Banknote,
  AlertCircle,
  XCircle,
  Printer,
  Bluetooth,
  BluetoothOff,
} from "lucide-react";
import { cn } from "../../utils/cn";
import {
  connectPrinter,
  disconnectPrinter,
  isPrinterConnected,
  printKitchenOrder,
  type KitchenTicketData,
} from "../../utils/thermalPrinter";

const payLabel = (m: string) =>
  ({
    PIX: "Pix",
    CREDITO: "Crédito",
    DEBITO: "Débito",
    DINHEIRO: "Dinheiro",
    CARTAO: "Cartão",
  })[m] ?? m;

const payStatusBadge = (status?: string) => {
  if (status === "APROVADO")
    return (
      <span className="text-[10px] bg-emerald-500/10 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
        Pago
      </span>
    );
  if (status === "PENDENTE")
    return (
      <span className="text-[10px] bg-red-50 text-red-500 border border-red-200 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
        <AlertCircle className="w-2.5 h-2.5" />
        Não Pago
      </span>
    );
  return null;
};

export const KitchenPanel: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [confirmCancel, setConfirmCancel] = useState<string | null>(null);
  const [printerStatus, setPrinterStatus] = useState<
    "disconnected" | "connecting" | "connected"
  >("disconnected");
  const [autoPrint, setAutoPrint] = useState(true);
  const printedIds = useRef<Set<string>>(new Set());
  const load = useCallback(async () => {
    try {
      const data = await getKitchenOrders();
      const active = data.filter((o) => o.status === "PREPARING");
      if (autoPrint && isPrinterConnected()) {
        for (const order of active) {
          if (!printedIds.current.has(order.id)) {
            printedIds.current.add(order.id);

            const ticketData: KitchenTicketData = {
              pedidoId: order.orderNumber,
              nomeCliente: order.customerName ?? null,
              metodoPagamento: order.paymentMethod,
              statusPagamento: order.paymentStatus,
              createdAt: order.createdAt,
              itens: order.items.map((i) => ({
                nome: i.product.name,
                quantidade: i.quantity,
                observacao: i.notes ?? null,
              })),
            };
            printKitchenOrder(ticketData)
              .then((ok) => {
                if (ok)
                  toast("info", `Pedido #${order.orderNumber} impresso ✓`);
                else
                  toast(
                    "warning",
                    `Impressora não respondeu — Pedido #${order.orderNumber}`,
                  );
              })
              .catch(() => {});
          }
        }
      }

      setOrders(active);
    } catch {
      toast("error", "Erro ao carregar pedidos da cozinha");
    } finally {
      setLoading(false);
    }
  }, [autoPrint, toast]);

  useEffect(() => {
    load();
    const interval = setInterval(load, 20_000);
    return () => clearInterval(interval);
  }, [load]);

  const handleConnectPrinter = async () => {
    if (printerStatus === "connected") {
      disconnectPrinter();
      setPrinterStatus("disconnected");
      toast("info", "Impressora desconectada.");
      return;
    }

    setPrinterStatus("connecting");
    const ok = await connectPrinter();
    if (ok) {
      setPrinterStatus("connected");
      toast("success", "Impressora conectada com sucesso!");
    } else {
      setPrinterStatus("disconnected");
      toast(
        "error",
        "Não foi possível conectar à impressora. Verifique o Bluetooth.",
      );
    }
  };

  const handleReprint = async (order: KitchenOrder) => {
    if (!isPrinterConnected()) {
      toast("warning", "Conecte a impressora primeiro.");
      return;
    }
    const ticketData: KitchenTicketData = {
      pedidoId: order.orderNumber,
      nomeCliente: order.customerName ?? null,
      metodoPagamento: order.paymentMethod,
      statusPagamento: order.paymentStatus,
      createdAt: order.createdAt,
      itens: order.items.map((i) => ({
        nome: i.product.name,
        quantidade: i.quantity,
        observacao: i.notes ?? null,
      })),
    };
    const ok = await printKitchenOrder(ticketData);
    if (ok) toast("success", `Pedido #${order.orderNumber} reimpresso.`);
    else toast("error", "Falha ao reimprimir.");
  };

  const markDelivered = async (order: KitchenOrder) => {
    setUpdating(order.id);
    try {
      await updateOrderStatus(order.id, "DELIVERED");
      toast("success", `Pedido #${order.orderNumber} marcado como entregue!`);
      setOrders((prev) => prev.filter((o) => o.id !== order.id));
    } catch (err: any) {
      toast("error", err?.response?.data?.error ?? "Erro ao atualizar pedido.");
    } finally {
      setUpdating(null);
    }
  };

  const markCancelled = async (order: KitchenOrder) => {
    setUpdating(order.id);
    setConfirmCancel(null);
    try {
      await updateOrderStatus(order.id, "CANCELLED");
      const extra =
        order.paymentStatus === "APROVADO" ? " — verificar estorno." : ".";
      toast("success", `Pedido #${order.orderNumber} cancelado${extra}`);
      setOrders((prev) => prev.filter((o) => o.id !== order.id));
    } catch (err: any) {
      toast("error", err?.response?.data?.error ?? "Erro ao cancelar pedido.");
    } finally {
      setUpdating(null);
    }
  };

  const printerIcon =
    printerStatus === "connected" ? (
      <Bluetooth className="w-4 h-4" />
    ) : printerStatus === "connecting" ? (
      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
    ) : (
      <BluetoothOff className="w-4 h-4" />
    );

  const printerBtnCls =
    printerStatus === "connected"
      ? "bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/25"
      : printerStatus === "connecting"
        ? "bg-amber-400 text-white cursor-wait"
        : "bg-surf-200 hover:bg-surf-300 text-ink-600";

  return (
    <div className="h-full overflow-y-auto bg-surf-50 p-5 lg:p-7">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/lanchonete")}
            className="flex items-center gap-1.5 text-ink-400 hover:text-ink-700 text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar
          </button>
          <div className="w-px h-4 bg-surf-300" />
          <ChefHat className="w-5 h-5 text-amber-500" />
          <h1 className="font-display text-xl font-bold text-ink-900">
            Cozinha
          </h1>
          {orders.length > 0 && (
            <span className="bg-amber-50 text-amber-700 border border-amber-200 text-xs px-2.5 py-0.5 rounded-full font-semibold">
              {orders.length} em preparo
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {printerStatus === "connected" && (
            <button
              onClick={() => setAutoPrint((p) => !p)}
              className={cn(
                "flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border transition-all",
                autoPrint
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-surf-100 text-ink-400 border-surf-200",
              )}
            >
              <Printer className="w-3.5 h-3.5" />
              {autoPrint ? "Auto-print ON" : "Auto-print OFF"}
            </button>
          )}
          <button
            onClick={handleConnectPrinter}
            disabled={printerStatus === "connecting"}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all",
              printerBtnCls,
            )}
          >
            {printerIcon}
            {printerStatus === "connected"
              ? "Impressora conectada"
              : printerStatus === "connecting"
                ? "Conectando..."
                : "Conectar impressora"}
          </button>
          <button
            onClick={load}
            className="p-2 rounded-xl text-ink-400 hover:text-amber-600 hover:bg-amber-50 transition-all"
            title="Recarregar"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
      {printerStatus === "disconnected" && (
        <div className="mb-5 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <BluetoothOff className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-800 text-sm font-semibold">
              Impressora não conectada
            </p>
            <p className="text-amber-600 text-xs mt-0.5">
              Clique em "Conectar impressora" para parear com a impressora
              térmica Bluetooth. Os pedidos continuam aparecendo normalmente sem
              impressão.
            </p>
          </div>
        </div>
      )}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-surf-100 border border-surf-200 rounded-2xl flex items-center justify-center mb-4">
            <ChefHat className="w-8 h-8 text-ink-300" />
          </div>
          <p className="text-ink-500 font-medium">Nenhum pedido em preparo</p>
          <p className="text-ink-300 text-sm mt-1">
            Atualiza automaticamente a cada 20s
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {orders.map((order, idx) => (
            <div
              key={order.id}
              className="bg-white border-2 border-amber-200 rounded-2xl p-5 flex flex-col gap-4 animate-slide-up shadow-card"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="flex items-center justify-between">
                <p className="font-display font-bold text-amber-500 text-2xl">
                  #{order.orderNumber}
                </p>
                <span className="flex items-center gap-1 text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-semibold">
                  <Clock className="w-2.5 h-2.5" />
                  Em Preparo
                </span>
              </div>
              {order.customerName && (
                <div className="flex items-center gap-1.5 -mt-1">
                  <User className="w-3.5 h-3.5 text-ink-400" />
                  <p className="text-ink-700 text-sm font-semibold">
                    {order.customerName}
                  </p>
                </div>
              )}
              <div className="space-y-2 flex-1">
                {order.items.map((item) => (
                  <div key={item.id}>
                    <div className="flex items-start gap-2">
                      <span className="text-amber-600 font-mono font-bold text-sm flex-shrink-0">
                        {item.quantity}×
                      </span>
                      <span className="text-ink-900 text-sm font-semibold leading-snug">
                        {item.product.name}
                      </span>
                    </div>
                    {item.notes && (
                      <p className="text-ink-400 text-xs italic ml-5 mt-0.5">
                        obs: {item.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-surf-200 space-y-1.5">
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <div className="flex items-center gap-1.5 text-ink-400">
                    <Banknote className="w-3 h-3" />
                    <span className="text-xs">
                      {payLabel(order.paymentMethod)}
                    </span>
                    {payStatusBadge(order.paymentStatus)}
                  </div>
                  <span className="text-emerald-600 font-mono text-sm font-bold">
                    {formatCurrency(order.total)}
                  </span>
                </div>
                {order.createdAt && (
                  <p className="text-ink-300 text-[11px]">
                    {formatTime(order.createdAt)}
                  </p>
                )}
                {order.operador && (
                  <p className="text-ink-300 text-[11px]">
                    Op: {order.operador}
                  </p>
                )}
              </div>
              {confirmCancel === order.id ? (
                <div className="space-y-2">
                  <p className="text-red-500 text-xs text-center font-semibold">
                    Confirmar cancelamento?
                  </p>
                  {order.paymentStatus === "APROVADO" && (
                    <p className="text-amber-600 text-[11px] text-center">
                      Requer verificação de estorno
                    </p>
                  )}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setConfirmCancel(null)}
                      className="py-2 rounded-xl bg-surf-100 hover:bg-surf-200 text-ink-600 text-xs font-semibold transition-all"
                    >
                      Voltar
                    </button>
                    <button
                      onClick={() => markCancelled(order)}
                      disabled={updating === order.id}
                      className="py-2 rounded-xl bg-red-500 hover:bg-red-400 disabled:opacity-50 text-white text-xs font-bold transition-all flex items-center justify-center gap-1"
                    >
                      {updating === order.id ? (
                        <Spinner size="sm" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5" />
                      )}
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setConfirmCancel(order.id)}
                      disabled={!!updating}
                      className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-500 text-xs font-semibold hover:bg-red-100 disabled:opacity-40 transition-all"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Cancelar
                    </button>
                    <button
                      onClick={() => markDelivered(order)}
                      disabled={!!updating}
                      className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold disabled:opacity-50 transition-all shadow-md shadow-emerald-500/20"
                    >
                      {updating === order.id ? (
                        <Spinner size="sm" className="border-t-white" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      )}
                      Entregue
                    </button>
                  </div>
                  {printerStatus === "connected" && (
                    <button
                      onClick={() => handleReprint(order)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-surf-100 hover:bg-surf-200 text-ink-500 text-xs font-medium transition-all border border-surf-200"
                    >
                      <Printer className="w-3 h-3" /> Reimprimir ticket
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
