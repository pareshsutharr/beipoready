import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default";
}

export function Button({ className, variant = "default", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "retro inline-flex items-center justify-center border-4 border-b-8 border-r-8 border-slate-950 bg-brand-gold px-5 py-3 text-xs font-bold uppercase tracking-wide text-brand-navy shadow-none transition-transform hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:border-b-4 active:border-r-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variant === "default" && "",
        className,
      )}
      {...props}
    />
  );
}
