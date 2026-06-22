import type { ComponentPropsWithoutRef } from "react";

type BadgeVariant = "gold" | "navy" | "success" | "warning" | "neutral";

interface BadgeProps extends ComponentPropsWithoutRef<"span"> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  gold:    "bg-brand-gold/15 text-brand-gold   border-brand-gold/25",
  navy:    "bg-brand-navy/10 text-brand-navy   border-brand-navy/20",
  success: "bg-emerald-50    text-emerald-700  border-emerald-200",
  warning: "bg-amber-50      text-amber-700    border-amber-200",
  neutral: "bg-slate-100     text-slate-600    border-slate-200",
};

export default function Badge({
  variant = "neutral",
  className = "",
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border",
        "font-sans text-xs font-semibold uppercase tracking-wider",
        variantClasses[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </span>
  );
}
