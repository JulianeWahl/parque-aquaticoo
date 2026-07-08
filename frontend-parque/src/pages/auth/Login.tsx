import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

export const LoginPage: React.FC = () => {
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Preencha e-mail e senha.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await signIn({ email, password });
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          err?.response?.data?.error ??
          "E-mail ou senha inválidos.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden px-4 py-8"
      style={{
        backgroundImage: "url('/parque-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, rgba(3,28,42,0.96) 0%, rgba(5,38,56,0.92) 45%, rgba(3,28,42,0.88) 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40 Q20 20 40 40 T80 40' stroke='%2336d1fb' fill='none' stroke-width='1.5'/%3E%3C/svg%3E")`,
          backgroundSize: "80px 80px",
        }}
      />
      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        <div className="text-center mb-6 sm:mb-7">
          <h1
            className="font-extrabold leading-none tracking-tight text-white"
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              textShadow: "0 4px 20px rgba(0,0,0,0.45)",
            }}
          >
            PARQUE AQUÁTICO
          </h1>

          <h2
            className="font-extrabold leading-none mt-2"
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
              color: "#fb923c",
              textShadow: "0 4px 18px rgba(251,146,60,0.35)",
            }}
          >
            OLHO D'ÁGUA
          </h2>

          <p className="text-cyan-100/80 text-sm sm:text-base font-medium mt-3">
            Sistema de Gestão
          </p>
        </div>
        <div
          className="w-full rounded-3xl p-6 sm:p-8 shadow-2xl"
          style={{
            background: "rgba(255,255,255,0.14)",
            backdropFilter: "blur(22px)",
            WebkitBackdropFilter: "blur(22px)",
            border: "1.5px solid rgba(255,255,255,0.18)",
          }}
        >
          <h3 className="text-white text-xl font-bold mb-6">
            Faça o seu Login
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2 bg-red-500/20 border border-red-400/30 rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4 text-red-300 flex-shrink-0" />
                <p className="text-red-100 text-sm">{error}</p>
              </div>
            )}
            <div>
              <label className="block text-cyan-100 text-xs uppercase tracking-wider font-semibold mb-2">
                LOGIN
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@gmail.com"
                autoComplete="email"
                required
                className="w-full rounded-2xl px-4 py-3.5 text-white placeholder-white/40 outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1.5px solid rgba(255,255,255,0.18)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(56,189,248,0.8)";
                  e.target.style.boxShadow = "0 0 0 4px rgba(56,189,248,0.12)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255,255,255,0.18)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
            <div>
              <label className="block text-cyan-100 text-xs uppercase tracking-wider font-semibold mb-2">
                Senha
              </label>

              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full rounded-2xl px-4 py-3.5 pr-12 text-white placeholder-white/40 outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1.5px solid rgba(255,255,255,0.18)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(56,189,248,0.8)";
                    e.target.style.boxShadow =
                      "0 0 0 4px rgba(56,189,248,0.12)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(255,255,255,0.18)";
                    e.target.style.boxShadow = "none";
                  }}
                />

                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/55 hover:text-white transition-colors"
                >
                  {showPwd ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl text-white font-bold text-sm transition-all hover:scale-[1.01] active:scale-[0.99]"
              style={{
                background: "linear-gradient(135deg, #f97316 0%, #fb923c 100%)",
                boxShadow: "0 10px 25px rgba(249,115,22,0.28)",
              }}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Entrando...
                </div>
              ) : (
                "Acessar Sistema"
              )}
            </button>
          </form>
        </div>
        <p className="text-white/45 text-xs text-center mt-6">
          Parque Aquático Olho D'Água © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};
