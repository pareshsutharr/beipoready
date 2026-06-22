import type { ComponentPropsWithoutRef } from "react";

interface CardProps extends ComponentPropsWithoutRef<"div"> {
  /** Enable lift-shadow + gold border hover effect (default: true) */
  hover?: boolean;
  /** Padding preset. "none" lets the caller control padding completely. */
  padding?: "sm" | "md" | "lg" | "none";
}

const paddingClasses = {
  sm:   "p-4",
  md:   "p-6",
  lg:   "p-8",
  none: "",
};

export default function Card({
  hover = true,
  padding = "md",
  className = "",
  children,
  ...rest
}: CardProps) {
  const classes = [
    "bg-white rounded-xl border border-slate-200 shadow-sm",
    hover && "hover:shadow-md hover:border-brand-gold/60 transition-all duration-200",
    paddingClasses[padding],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}
