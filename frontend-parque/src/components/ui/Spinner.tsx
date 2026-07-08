import React from "react";
import { cn } from "../../utils/cn";

interface Props { size?: "sm" | "md" | "lg"; className?: string; }

const sizes = { sm: "w-4 h-4 border-2", md: "w-6 h-6 border-2", lg: "w-8 h-8 border-[3px]" };

export const Spinner: React.FC<Props> = ({ size = "md", className }) => (
  <div className={cn("rounded-full animate-spin border-ink-200 border-t-aqua-500", sizes[size], className)} />
);
