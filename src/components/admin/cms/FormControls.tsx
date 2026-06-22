export const inputClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/30";

export const labelClass = "mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500";

export const cardClass = "rounded-xl border border-slate-200 bg-white p-5 shadow-sm";

export const blogCategories = [
  "sme-ipo",
  "pre-ipo-fundraising",
  "ipo-readiness",
  "valuation",
  "compliance",
  "capital-markets",
].map((value) => ({ value, label: value.replaceAll("-", " ") }));

export const faqCategories = [
  "sme-ipo-eligibility",
  "ipo-timeline",
  "ipo-cost",
  "pre-ipo-fundraising",
  "valuation",
  "compliance",
  "documentation",
  "investor-readiness",
].map((value) => ({ value, label: value.replaceAll("-", " ") }));

export const statuses = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
];

export const placements = [
  { value: "banner", label: "Top banner" },
  { value: "popup", label: "Popup modal" },
];

export function Field({
  label,
  name,
  defaultValue,
  required,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  required?: boolean;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue ?? ""}
        className={inputClass}
      />
    </label>
  );
}

export function TextArea({
  label,
  name,
  defaultValue,
  rows = 4,
  required,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  rows?: number;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <textarea
        name={name}
        rows={rows}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue ?? ""}
        className={inputClass}
      />
    </label>
  );
}

export function Select({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <select name={name} defaultValue={defaultValue ?? options[0]?.value} className={inputClass}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Checkbox({
  label,
  name,
  defaultChecked,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
      <input
        name={name}
        type="checkbox"
        defaultChecked={defaultChecked}
        className="h-4 w-4 rounded border-slate-300 text-brand-gold"
      />
      {label}
    </label>
  );
}

export function SubmitRow({
  deleteAction,
  id,
  saveLabel = "Save",
}: {
  deleteAction?: (formData: FormData) => void | Promise<void>;
  id?: string;
  saveLabel?: string;
}) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <button
        type="submit"
        className="rounded-lg bg-brand-navy px-4 py-2 text-sm font-semibold text-white hover:bg-brand-navy/90"
      >
        {saveLabel}
      </button>
      {deleteAction && id && (
        <button
          formAction={deleteAction}
          className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
        >
          Delete
        </button>
      )}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">{eyebrow}</p>
      <h1 className="mt-2 font-serif text-2xl font-bold text-brand-navy">{title}</h1>
      <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}

export function ImagePreview({
  url,
  label,
  fit = "cover",
}: {
  url?: string | null;
  label: string;
  fit?: "cover" | "contain";
}) {
  if (!url) return null;

  return (
    <div
      className={`h-32 rounded-lg border border-slate-200 bg-center bg-no-repeat ${fit === "contain" ? "bg-contain" : "bg-cover"}`}
      style={{ backgroundImage: `url("${url}")` }}
      role="img"
      aria-label={label}
    />
  );
}
