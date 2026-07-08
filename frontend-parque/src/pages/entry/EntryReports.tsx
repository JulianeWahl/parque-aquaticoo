import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getEntradaDashboard } from "../../api/tickets";
import type { EntradaDashboard, VendaEntry } from "../../types/ticket";
import { formatCurrency } from "../../utils/role";
import { StatCard } from "../../components/ui/StatCard";
import {
  ArrowLeft,
  ShoppingBag,
  DollarSign,
  QrCode,
  Banknote,
  CreditCard,
  RefreshCw,
  Calendar,
  ChevronDown,
  User,
  Tag,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { cn } from "../../utils/cn";

type Period = "hoje" | "semana" | "mes" | "custom";
const PERIODS = [
  { value: "hoje" as Period, label: "Hoje", apiValue: "daily" },
  { value: "semana" as Period, label: "Esta semana", apiValue: "weekly" },
  { value: "mes" as Period, label: "Este mês", apiValue: "monthly" },
  { value: "custom" as Period, label: "Personalizado", apiValue: "custom" },
];
const PAY_CONFIG = [
  {
    key: "PIX",
    label: "Pix",
    icon: <QrCode className="w-3.5 h-3.5" />,
    color: "bg-sky-500/70",
  },
  {
    key: "CREDITO",
    label: "Crédito",
    icon: <CreditCard className="w-3.5 h-3.5" />,
    color: "bg-violet-500/70",
  },
  {
    key: "DEBITO",
    label: "Débito",
    icon: <CreditCard className="w-3.5 h-3.5" />,
    color: "bg-slate-500/70",
  },
  {
    key: "DINHEIRO",
    label: "Dinheiro",
    icon: <Banknote className="w-3.5 h-3.5" />,
    color: "bg-emerald-500/70",
  },
];
const formatDateTime = (d: string) => {
  if (!d) return "—";
  const dt = new Date(d);
  return (
    dt.toLocaleDateString("pt-BR") +
    " " +
    dt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
  );
};

/** APROVADO = green, PENDENTE = red, RECUSADO = red */
const statusBadge = (s: string | null) => {
  if (s === "APROVADO")
    return (
      <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-semibold">
        <CheckCircle2 className="w-2.5 h-2.5" />
        Pago
      </span>
    );
  if (s === "PENDENTE")
    return (
      <span className="inline-flex items-center gap-1 text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full font-semibold">
        <Clock className="w-2.5 h-2.5" />
        Não Pago
      </span>
    );
  if (s === "RECUSADO")
    return (
      <span className="inline-flex items-center gap-1 text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full font-semibold">
        <XCircle className="w-2.5 h-2.5" />
        Recusado
      </span>
    );
  return null;
};
const payLabel = (m: string | null) =>
  (
    ({
      PIX: "Pix",
      CREDITO: "Crédito",
      DEBITO: "Débito",
      DINHEIRO: "Dinheiro",
    }) as any
  )[m ?? ""] ??
  m ??
  "—";

export const EntryReports: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<EntradaDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [period, setPeriod] = useState<Period>("hoje");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(false);
    const p = PERIODS.find((x) => x.value === period);
    const params =
      period === "custom" && startDate && endDate
        ? { startDate, endDate }
        : { period: p?.apiValue ?? "daily" };
    getEntradaDashboard(params)
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [period, startDate, endDate]);

  useEffect(() => {
    load();
  }, [load]);

  const activePeriodLabel =
    PERIODS.find((p) => p.value === period)?.label ?? "Hoje";
  const approvedCount =
    data?.vendas?.filter((v) => v.statusPagamento === "APROVADO").length ?? 0;
  const pendingCount =
    data?.vendas?.filter((v) => v.statusPagamento === "PENDENTE").length ?? 0;

  return (
    <div className="h-full overflow-y-auto bg-surf-50 p-5 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/entrada")}
            className="flex items-center gap-1.5 text-ink-500 hover:text-ink-900 text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar
          </button>
          <div className="w-px h-4 bg-surf-200" />
          <h1 className="font-display text-xl font-bold text-ink-900">
            Relatórios da Entrada
          </h1>
        </div>
        <button
          onClick={load}
          className="p-2 rounded-xl text-ink-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-3 mb-7">
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 bg-surf-50 border border-surf-200 hover:border-blue-500/40 rounded-xl px-4 py-2.5 text-sm text-ink-900 transition-all"
          >
            <Calendar className="w-4 h-4 text-blue-400" />
            {activePeriodLabel}
            <ChevronDown
              className={cn(
                "w-3.5 h-3.5 text-ink-400 transition-transform",
                showMenu && "rotate-180",
              )}
            />
          </button>
          {showMenu && (
            <div className="absolute top-full mt-1.5 left-0 bg-white border border-surf-200 rounded-xl shadow-xl z-20 min-w-[180px] overflow-hidden animate-scale-in">
              {PERIODS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => {
                    setPeriod(p.value);
                    setShowMenu(false);
                  }}
                  className={cn(
                    "w-full text-left px-4 py-2.5 text-sm transition-colors",
                    period === p.value
                      ? "bg-blue-500/10 text-blue-400"
                      : "text-ink-600 hover:bg-surf-50",
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}
        </div>
        {period === "custom" && (
          <div className="flex items-center gap-2 flex-wrap">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-surf-50 border border-surf-200 rounded-xl px-3 py-2 text-sm text-ink-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
            <span className="text-ink-400 text-sm">até</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-surf-50 border border-surf-200 rounded-xl px-3 py-2 text-sm text-ink-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
            <button
              onClick={load}
              disabled={!startDate || !endDate}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-surf-200 disabled:text-ink-400 text-ink-900 text-sm font-semibold rounded-xl transition-all"
            >
              Filtrar
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-28 rounded-2xl" />
            ))}
          </div>
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="skeleton h-20 rounded-2xl" />
            ))}
          </div>
        </>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
          <p className="text-ink-400 text-sm">
            Não foi possível carregar os dados.
          </p>
          <button
            onClick={load}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-ink-900 text-sm font-semibold rounded-xl"
          >
            Tentar novamente
          </button>
        </div>
      ) : data ? (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
            <StatCard
              label="Vendas"
              value={data.quantidadeVendas ?? 0}
              icon={<ShoppingBag className="w-4 h-4" />}
              accent="cyan"
            />
            <StatCard
              label="Faturamento"
              value={formatCurrency(data.total ?? 0)}
              icon={<DollarSign className="w-4 h-4" />}
              accent="green"
            />
            <StatCard
              label="Pagos"
              value={approvedCount}
              icon={<CheckCircle2 className="w-4 h-4" />}
              accent="green"
            />
            <StatCard
              label="Pendentes"
              value={pendingCount}
              icon={<Clock className="w-4 h-4" />}
              accent={pendingCount > 0 ? "amber" : "slate"}
            />
          </div>
          {(data.quantidadeVendas ?? 0) > 0 && (
            <div className="bg-white border border-surf-200 rounded-2xl p-5 mb-5">
              <h2 className="font-display font-bold text-ink-900 text-sm mb-4 uppercase tracking-wide">
                Formas de Pagamento (somente pagos)
              </h2>
              <div className="space-y-3">
                {PAY_CONFIG.map(({ key, label, icon, color }) => {
                  const value = (data.pagamentos as any)?.[key] ?? 0;
                  if (value === 0) return null;
                  const pct =
                    data.total > 0 ? Math.round((value / data.total) * 100) : 0;
                  return (
                    <div key={key}>
                      <div className="flex items-center justify-between text-sm mb-1.5">
                        <div className="flex items-center gap-2 text-ink-500">
                          {icon}
                          {label}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-ink-400 text-xs">{pct}%</span>
                          <span className="text-ink-900 font-semibold">
                            {formatCurrency(value)}
                          </span>
                        </div>
                      </div>
                      <div className="h-1.5 bg-surf-200 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-700",
                            color,
                          )}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <h2 className="font-display font-bold text-ink-900 text-base mb-3">
            Vendas Realizadas
            <span className="text-ink-400 font-normal text-sm ml-2">
              ({data.vendas?.length ?? 0})
            </span>
          </h2>
          {(data.vendas?.length ?? 0) === 0 ? (
            <div className="text-center py-10 bg-white border border-surf-100 rounded-2xl">
              <ShoppingBag className="w-10 h-10 text-ink-300 mx-auto mb-2" />
              <p className="text-ink-400 text-sm">Nenhuma venda no período</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {(data.vendas ?? []).map((venda: VendaEntry) => (
                <div
                  key={venda.id}
                  className="bg-white border border-surf-200 rounded-2xl overflow-hidden hover:border-blue-500/20 transition-all"
                >
                  <button
                    onClick={() =>
                      setExpandedId(expandedId === venda.id ? null : venda.id)
                    }
                    className="w-full flex items-center justify-between px-5 py-4 text-left"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-ink-900 text-sm">
                          Venda #{venda.id}
                        </p>
                        {statusBadge(venda.statusPagamento)}
                      </div>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        {venda.nomeCliente && (
                          <span className="text-ink-400 text-xs flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {venda.nomeCliente}
                          </span>
                        )}
                        {venda.usuario && (
                          <span className="text-ink-400 text-xs">
                            Op: {venda.usuario}
                          </span>
                        )}
                        <span className="text-ink-300 text-xs">
                          {formatDateTime(venda.data)}
                        </span>
                      </div>
                      <p className="text-ink-400 text-xs mt-0.5">
                        {venda.itens
                          ?.map((i) => `${i.quantidade}× ${i.categoria}`)
                          .join(", ")}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <p className="font-display font-bold text-emerald-400 text-lg">
                        {formatCurrency(venda.total)}
                      </p>
                      <p className="text-ink-400 text-xs mt-0.5">
                        {payLabel(venda.metodoPagamento)}
                      </p>
                      {venda.cupomAplicado && (
                        <p className="text-ink-400 text-[10px] flex items-center gap-1 justify-end mt-0.5">
                          <Tag className="w-2.5 h-2.5" />
                          {venda.cupomAplicado}
                        </p>
                      )}
                    </div>
                  </button>
                  {expandedId === venda.id && (
                    <div className="px-5 pb-4 border-t border-surf-200 pt-3 animate-fade-in">
                      <p className="text-xs text-ink-400 uppercase tracking-widest mb-2">
                        Ingressos
                      </p>
                      <div className="space-y-1.5">
                        {venda.itens?.map((item, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className="text-ink-600">
                              {item.quantidade}× {item.categoria}
                            </span>
                            <span className="text-ink-500">
                              {formatCurrency(item.subtotal)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      ) : null}
    </div>
  );
};
