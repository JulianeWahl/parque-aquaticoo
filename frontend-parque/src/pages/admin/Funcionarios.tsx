import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getRoles, createUser } from "../../api/users";
import type { Role } from "../../api/users";
import { useToast } from "../../components/ui/Toast";
import { useAuth } from "../../hooks/useAuth";
import {
  ArrowLeft,
  UserPlus,
  Users,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { cn } from "../../utils/cn";
import { Spinner } from "../../components/ui/Spinner";

type RoleNome = "ADMIN" | "FUNCIONARIO";
type ModuloNome = "ENTRADA" | "LANCHONETE";

export const Funcionarios: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const myModule = user?.module as ModuloNome | undefined;
  const backPath = myModule === "ENTRADA" ? "/entrada" : "/lanchonete";
  const isBlue = myModule === "ENTRADA";

  const [roles, setRoles] = useState<Role[]>([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [rolesError, setRolesError] = useState(false);
  const [selectedRoleNome, setSelectedRoleNome] =
    useState<RoleNome>("FUNCIONARIO");
  const [form, setForm] = useState({ nome: "", email: "", senha: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const loadRoles = () => {
    setRolesLoading(true);
    setRolesError(false);
    getRoles()
      .then((r) => {
        const filtered = myModule
          ? r.filter((role) => role.modulo === myModule)
          : r;
        setRoles(filtered);
        setRolesLoading(false);
      })
      .catch(() => {
        setRolesError(true);
        setRolesLoading(false);
      });
  };

  useEffect(() => {
    loadRoles();
  }, [myModule]);

  const resolvedRole = roles.find(
    (r) => r.nome === selectedRoleNome && r.modulo === myModule,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome.trim() || !form.email.trim() || !form.senha.trim()) {
      setError("Preencha todos os campos.");
      return;
    }
    if (form.senha.length < 6) {
      setError("Senha deve ter ao menos 6 caracteres.");
      return;
    }
    if (!resolvedRole) {
      setError(
        "Não foi possível encontrar o perfil de acesso. Verifique a rota GET /roles no backend.",
      );
      return;
    }

    setError("");
    setLoading(true);
    try {
      await createUser({
        nome: form.nome.trim(),
        email: form.email.trim().toLowerCase(),
        senha: form.senha,
        roleId: resolvedRole.id,
      });
      toast("success", `Funcionário "${form.nome}" criado com sucesso!`);
      setSuccess(true);
      setForm({ nome: "", email: "", senha: "" });
    } catch (err: any) {
      setError(
        err?.response?.data?.error ??
          err?.response?.data?.message ??
          "Erro ao criar funcionário.",
      );
    } finally {
      setLoading(false);
    }
  };

  const focusCls = isBlue
    ? "focus:ring-blue-500/40 focus:border-blue-500/60"
    : "focus:ring-orange-500/40 focus:border-orange-500/60";

  const btnCls = isBlue
    ? "bg-blue-600 hover:bg-blue-500 shadow-blue-600/20"
    : "bg-orange-500 hover:bg-orange-400 shadow-orange-500/20";

  const accentCls = isBlue ? "text-blue-400" : "text-orange-400";
  const accentBgCls = isBlue
    ? "bg-blue-500/10 border-blue-500/20"
    : "bg-orange-500/10 border-orange-500/20";

  return (
    <div className="h-full overflow-y-auto bg-surf-50 p-5 lg:p-8 flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(backPath)}
          className="flex items-center gap-1.5 text-ink-500 hover:text-ink-900 text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>
        <div className="w-px h-4 bg-surf-200" />
        <Users className="w-5 h-5 text-ink-500" />
        <h1 className="font-display text-xl font-bold text-ink-900">
          Gerenciar Funcionários
        </h1>
        <span
          className={cn(
            "text-xs font-semibold px-2.5 py-0.5 rounded-full border",
            accentCls,
            accentBgCls,
          )}
        >
          {myModule}
        </span>
      </div>

      <div className="max-w-md mx-auto w-full space-y-5 flex flex-col justify-center flex-1 py-4">
        {success && (
          <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <p className="text-emerald-300 text-sm flex-1">
              Funcionário criado com sucesso!
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="text-emerald-600 hover:text-emerald-400 text-xs"
            >
              Criar outro
            </button>
          </div>
        )}
        {rolesLoading ? (
          <div className="flex items-center gap-3 bg-white border border-surf-200 rounded-xl px-4 py-3">
            <Spinner size="sm" />{" "}
            <p className="text-ink-400 text-sm">Carregando perfis...</p>
          </div>
        ) : rolesError ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <p className="text-red-400 text-sm font-semibold">
                Rota GET /roles não encontrada no backend
              </p>
            </div>
            <p className="text-ink-400 text-xs leading-relaxed mb-2">
              Para criar funcionários, adicione esta rota ao backend:
            </p>
            <code className="block bg-white text-emerald-400 text-xs font-mono px-3 py-2 rounded-lg border border-surf-200">
              router.get("/roles", authMiddleware, async (req, res) =&gt; {"{"}
              {"  "}const roles = await prisma.role.findMany();
              {"  "}return res.json(roles);
              {"}"});
            </code>
            <button
              onClick={loadRoles}
              className="mt-3 flex items-center gap-1.5 text-ink-500 hover:text-ink-900 text-xs transition-colors"
            >
              <RefreshCw className="w-3 h-3" /> Tentar novamente
            </button>
          </div>
        ) : null}
        <div className="bg-white border border-surf-200 rounded-2xl p-7 shadow-card">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-9 h-9 bg-slate-500/10 border border-slate-500/20 rounded-xl flex items-center justify-center">
              <UserPlus className="w-4 h-4 text-ink-500" />
            </div>
            <div>
              <h2 className="font-display font-bold text-ink-900 text-sm">
                Novo Funcionário
              </h2>
              <p className="text-ink-400 text-xs">Módulo: {myModule}</p>
            </div>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2.5 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[11px] text-ink-500 font-semibold uppercase tracking-widest mb-2 block">
                Nome completo
              </label>
              <input
                value={form.nome}
                onChange={(e) =>
                  setForm((f) => ({ ...f, nome: e.target.value }))
                }
                placeholder="Ex: Maria Silva"
                className={`w-full bg-surf-50 border border-surf-200 rounded-xl px-4 py-3 text-sm text-ink-900 placeholder-ink-300 focus:outline-none focus:ring-2 transition-all ${focusCls}`}
              />
            </div>

            <div>
              <label className="text-[11px] text-ink-500 font-semibold uppercase tracking-widest mb-2 block">
                E-mail
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                placeholder="funcionario@parque.com"
                className={`w-full bg-surf-50 border border-surf-200 rounded-xl px-4 py-3 text-sm text-ink-900 placeholder-ink-300 focus:outline-none focus:ring-2 transition-all ${focusCls}`}
              />
            </div>

            <div>
              <label className="text-[11px] text-ink-500 font-semibold uppercase tracking-widest mb-2 block">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  value={form.senha}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, senha: e.target.value }))
                  }
                  placeholder="Mínimo 6 caracteres"
                  className={`w-full bg-surf-50 border border-surf-200 rounded-xl px-4 py-2.5 pr-11 text-sm text-ink-900 placeholder-ink-300 focus:outline-none focus:ring-2 transition-all ${focusCls}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
                >
                  {showPwd ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <label className="text-[11px] text-ink-500 font-semibold uppercase tracking-widest mb-2 block">
                Nível de acesso
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(["FUNCIONARIO", "ADMIN"] as RoleNome[]).map((nome) => {
                  const available = roles.some(
                    (r) => r.nome === nome && r.modulo === myModule,
                  );
                  return (
                    <button
                      key={nome}
                      type="button"
                      disabled={!available}
                      onClick={() => setSelectedRoleNome(nome)}
                      className={cn(
                        "flex items-center gap-2 p-3.5 rounded-xl border-2 transition-all",
                        selectedRoleNome === nome && available
                          ? `border-2 ${isBlue ? "border-blue-500 bg-blue-500/10 text-blue-400" : "border-orange-500 bg-orange-500/10 text-orange-400"}`
                          : "border-surf-200 bg-surf-50 text-ink-500 hover:border-base-600",
                        !available && "opacity-40 cursor-not-allowed",
                      )}
                    >
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-sm font-bold">
                          {nome === "ADMIN" ? "Administrador" : "Funcionário"}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
              {!resolvedRole && !rolesLoading && !rolesError && (
                <p className="text-amber-400/70 text-xs mt-2">
                  Perfil "{selectedRoleNome}" para o módulo {myModule} não
                  encontrado nos roles cadastrados.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || rolesError || rolesLoading || !resolvedRole}
              className={cn(
                "w-full font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-base mt-2",
                btnCls,
                "disabled:bg-surf-200 disabled:text-ink-400 disabled:shadow-none",
              )}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                  Criando...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" /> Criar Funcionário
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
