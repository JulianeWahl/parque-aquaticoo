import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "../../utils/cn";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const sizeMap = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-lg" };

export const Modal: React.FC<Props> = ({
  open,
  onClose,
  title,
  size = "md",
  children,
}) => {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div
        className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative w-full bg-white rounded-2xl shadow-xl border border-surf-200 animate-scale-in",
          sizeMap[size],
        )}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-surf-200">
          <h3 className="font-display font-bold text-ink-900 text-base">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-ink-400 hover:text-ink-700 hover:bg-surf-100 flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
};
