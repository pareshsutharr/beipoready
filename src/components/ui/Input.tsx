import type { ComponentPropsWithoutRef } from "react";

interface InputProps extends ComponentPropsWithoutRef<"input"> {
  /** Rendered as <label> and wired via htmlFor ↔ id */
  label: string;
  /** Must be provided, used for both id and htmlFor */
  id: string;
  error?: string;
}

export default function Input({ label, id, error, className = "", ...rest }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="font-sans text-sm font-medium text-brand-navy"
      >
        {label}
      </label>
      <input
        id={id}
        className={[
          "w-full rounded-lg border bg-white px-4 py-2.5 font-sans text-sm text-slate-800 placeholder:text-slate-400",
          "transition-colors duration-150",
          "focus:outline-none focus:ring-2 focus:ring-offset-1",
          error
            ? "border-red-400 focus:ring-red-400"
            : "border-slate-300 focus:border-brand-navy focus:ring-brand-navy/30",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={error ? true : undefined}
        {...rest}
      />
      {error && (
        <p id={`${id}-error`} className="font-sans text-xs text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
