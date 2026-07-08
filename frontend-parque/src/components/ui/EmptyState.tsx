import React from "react";
import { cn } from "../../utils/cn";

interface Props {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<Props> = ({ icon, title, description, action, className }) => (
  <div className={cn("flex flex-col items-center justify-center py-16 text-center", className)}>
    {icon && (
      <div className="w-16 h-16 rounded-2xl bg-base-800 border border-base-700 flex items-center justify-center mb-4 text-slate-500">
        {icon}
      </div>
    )}
    <p className="text-slate-300 font-medium text-base">{title}</p>
    {description && <p className="text-slate-600 text-sm mt-1">{description}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
);
