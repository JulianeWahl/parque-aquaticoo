import React from "react";
import { cn } from "../../utils/cn";
import { Spinner } from "./Spinner";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "amber";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
}

const variants = {
  primary: "bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold shadow-lg shadow-cyan-500/20",
  secondary: "bg-base-700 hover:bg-base-600 text-slate-200 border border-base-600",
  ghost: "hover:bg-base-800 text-slate-400 hover:text-slate-200",
  danger: "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20",
  amber: "bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold shadow-lg shadow-amber-500/20",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3.5 text-base",
};

export const Button: React.FC<Props> = ({
  variant = "primary", size = "md", loading, icon, children, className, disabled, ...props
}) => (
  <button
    {...props}
    disabled={disabled || loading}
    className={cn(
      "inline-flex items-center justify-center gap-2 rounded-xl transition-all duration-200",
      "disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50",
      variants[variant], sizes[size], className
    )}
  >
    {loading ? <Spinner size="sm" /> : icon}
    {children}
  </button>
);
