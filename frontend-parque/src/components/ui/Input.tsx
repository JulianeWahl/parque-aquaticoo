import React from "react";
import { cn } from "../../utils/cn";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<Props> = ({ label, error, icon, rightIcon, className, ...props }) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">
        {label}
      </label>
    )}
    <div className="relative">
      {icon && (
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
          {icon}
        </div>
      )}
      <input
        {...props}
        className={cn(
          "w-full bg-base-800 border border-base-600 rounded-xl px-4 py-3 text-sm text-slate-100",
          "placeholder-slate-600 transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/60",
          error && "border-red-500/60 focus:ring-red-500/30",
          icon && "pl-10",
          rightIcon && "pr-10",
          className
        )}
      />
      {rightIcon && (
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
          {rightIcon}
        </div>
      )}
    </div>
    {error && <p className="text-xs text-red-400">{error}</p>}
  </div>
);
