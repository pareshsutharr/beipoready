// Internal helper — used by LeadCaptureForm and ContactForm; not a public ui/ primitive.

interface SelectFieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  error?: string;
  required?: boolean;
}

export default function SelectField({
  label,
  id,
  value,
  onChange,
  options,
  placeholder = "Select…",
  error,
  required,
}: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-sans text-sm font-medium text-brand-navy">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className={[
            "w-full appearance-none rounded-lg border bg-white px-4 py-2.5 pr-10 font-sans text-sm transition-colors duration-150",
            "focus:outline-none focus:ring-2 focus:ring-offset-1",
            value ? "text-slate-800" : "text-slate-400",
            error
              ? "border-red-400 focus:ring-red-400"
              : "border-slate-300 focus:border-brand-navy focus:ring-brand-navy/30",
          ]
            .filter(Boolean)
            .join(" ")}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-invalid={error ? true : undefined}
        >
          <option value="" disabled hidden>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M4 6l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      {error && (
        <p id={`${id}-error`} className="font-sans text-xs text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
