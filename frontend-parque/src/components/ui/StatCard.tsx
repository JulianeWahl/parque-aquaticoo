import React from "react";
import { cn } from "../../utils/cn";

interface Props {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  accent?: "cyan" | "amber" | "green" | "red" | "slate" | "purple";
  sublabel?: string;
  className?: string;
}

const accents: Record<string, { card: string; value: string; icon: string }> = {
  cyan:   { card: "border-aqua-200",   value: "text-aqua-600",     icon: "bg-aqua-50 text-aqua-500 border border-aqua-200" },
  amber:  { card: "border-amber-200",  value: "text-amber-600",    icon: "bg-amber-50 text-amber-500 border border-amber-200" },
  green:  { card: "border-emerald-200",value: "text-emerald-600",  icon: "bg-emerald-50 text-emerald-500 border border-emerald-200" },
  red:    { card: "border-red-200",    value: "text-red-600",      icon: "bg-red-50 text-red-500 border border-red-200" },
  slate:  { card: "border-surf-300",   value: "text-ink-700",      icon: "bg-surf-100 text-ink-400 border border-surf-200" },
  purple: { card: "border-violet-200", value: "text-violet-600",   icon: "bg-violet-50 text-violet-500 border border-violet-200" },
};

export const StatCard: React.FC<Props> = ({ label, value, icon, accent = "slate", sublabel, className }) => {
  const a = accents[accent] ?? accents.slate;
  return (
    <div className={cn(
      "bg-white rounded-2xl p-5 flex flex-col gap-3 animate-slide-up border",
      a.card,
      "shadow-card hover:shadow-card-hover transition-shadow",
      className
    )}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-ink-400 uppercase tracking-widest">{label}</span>
        {icon && (
          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", a.icon)}>
            {icon}
          </div>
        )}
      </div>
      <div>
        <p className={cn("text-3xl font-display font-bold tracking-tight leading-none", a.value)}>{value}</p>
        {sublabel && <p className="text-xs text-ink-400 mt-1.5">{sublabel}</p>}
      </div>
    </div>
  );
};
