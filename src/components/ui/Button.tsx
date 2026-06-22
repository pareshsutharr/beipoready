import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-brand-gold text-brand-navy font-semibold shadow-md hover:bg-amber-400 active:scale-[0.98] focus-visible:ring-brand-gold",
  secondary:
    "bg-brand-navy text-white font-semibold hover:bg-[#083d5c] active:scale-[0.98] focus-visible:ring-brand-navy",
  ghost:
    "text-brand-navy font-semibold underline-offset-4 hover:underline hover:text-brand-navy/80 focus-visible:ring-brand-navy/40",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-4 py-2 text-sm rounded",
  md: "px-6 py-3 text-sm rounded-lg",
  lg: "px-8 py-4 text-base rounded-lg",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

/* ── Discriminated union: renders <Link> when href is present, <button> otherwise */

type AsButton = { href?: undefined } & ComponentPropsWithoutRef<"button">;
type AsLink   = { href: string }    & ComponentPropsWithoutRef<typeof Link>;

type ButtonProps = (AsButton | AsLink) & {
  variant?: Variant;
  size?: Size;
};

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}: ButtonProps) {
  const classes = [baseClasses, variantClasses[variant], sizeClasses[size], className]
    .filter(Boolean)
    .join(" ");

  if ("href" in rest && rest.href !== undefined) {
    const { href, ...linkRest } = rest as AsLink;
    return (
      <Link href={href} className={classes} {...linkRest}>
        {children}
      </Link>
    );
  }

  const buttonRest = rest as AsButton;
  return (
    <button className={classes} {...buttonRest}>
      {children}
    </button>
  );
}
