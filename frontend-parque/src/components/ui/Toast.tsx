import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";
import { cn } from "../../utils/cn";

type ToastType = "success" | "error" | "warning" | "info";

interface ToastItem { id: string; type: ToastType; message: string; }

interface Ctx { toast: (type: ToastType, message: string) => void; }

const ToastContext = createContext<Ctx>({ toast: () => {} });

const configs: Record<ToastType, { icon: React.ReactNode; cls: string }> = {
  success: { icon: <CheckCircle2 className="w-4 h-4" />, cls: "bg-white border-emerald-200 text-emerald-700 shadow-lg" },
  error:   { icon: <AlertCircle  className="w-4 h-4" />, cls: "bg-white border-red-200 text-red-600 shadow-lg" },
  warning: { icon: <AlertTriangle className="w-4 h-4" />, cls: "bg-white border-amber-200 text-amber-700 shadow-lg" },
  info:    { icon: <Info          className="w-4 h-4" />, cls: "bg-white border-aqua-200 text-aqua-700 shadow-lg" },
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((type: ToastType, message: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(p => [...p, { id, type, message }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  }, []);

  const dismiss = (id: string) => setToasts(p => p.filter(t => t.id !== id));

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 max-w-sm w-full">
        {toasts.map(t => {
          const c = configs[t.type];
          return (
            <div key={t.id}
              className={cn("flex items-center gap-3 px-4 py-3 rounded-xl border animate-slide-in-right", c.cls)}>
              {c.icon}
              <p className="text-sm font-medium flex-1">{t.message}</p>
              <button onClick={() => dismiss(t.id)} className="text-ink-300 hover:text-ink-600 transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
