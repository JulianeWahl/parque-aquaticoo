import React from "react";
import { cn } from "../../utils/cn";

type Variant = "cyan" | "green" | "amber" | "red" | "purple" | "slate";

const variants: Record<Variant, string> = {
  cyan:   "bg-aqua-50 text-aqua-700 border border-aqua-200",
  green:  "bg-emerald-50 text-emerald-700 border border-emerald-200",
  amber:  "bg-amber-50 text-amber-700 border border-amber-200",
  red:    "bg-red-50 text-red-600 border border-red-200",
  purple: "bg-violet-50 text-violet-700 border border-violet-200",
  slate:  "bg-surf-100 text-ink-500 border border-surf-200",
};

export const Badge: React.FC<{ variant?: Variant; className?: string; children: React.ReactNode }> = ({
  variant = "slate", className, children,
}) => (
  <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold", variants[variant], className)}>
    {children}
  </span>
);
