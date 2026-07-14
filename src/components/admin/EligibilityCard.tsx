"use client";

import { Printer, Mail, FileDown, Globe, Phone, Building2, CalendarDays } from "lucide-react";
import type { EligibilitySubmission } from "@/types";

const STATUS_COLORS: Record<string, string> = {
  "new": "bg-amber-100 text-amber-800 border-amber-200",
  "reviewed": "bg-blue-100 text-blue-800 border-blue-200",
  "contacted": "bg-emerald-100 text-emerald-800 border-emerald-200",
  "closed": "bg-slate-100 text-slate-600 border-slate-200",
};

const IMAGE_EXT_RE = /\.(jpe?g|png)$/i;

function fmtDate(d: string | null) {
  if (!d) return "N/A";
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function fmtInr(v: string | null) {
  if (!v) return "N/A";
  const n = Number(v.replace(/[,\s]/g, ""));
  if (Number.isNaN(n)) return v; // free-form text, show as entered
  return `₹${n.toLocaleString("en-IN")}`;
}

function YesNoPill({ label, value }: { label: string; value: boolean | null }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
        value === null
          ? "bg-slate-50 text-slate-400 border-slate-200"
          : value
            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
            : "bg-red-50 text-red-700 border-red-200"
      }`}
    >
      {label}
      <span aria-hidden="true">{value === null ? "N/A" : value ? "✓" : "✕"}</span>
    </span>
  );
}

export default function EligibilityCard({
  row,
  signedUrl,
}: {
  row: EligibilitySubmission;
  signedUrl: string | null;
}) {
  const purposes = row.fund_purposes?.length
    ? row.fund_purposes
        .map((p) => (p === "Other" && row.fund_purpose_other ? `Other: ${row.fund_purpose_other}` : p))
        .join(", ")
    : "N/A";

  const isImage = !!row.financials_file_path && IMAGE_EXT_RE.test(row.financials_file_path);

  const mailSubject = encodeURIComponent(
    `Your IPO eligibility review, ${row.organization_name}`
  );
  const mailBody = encodeURIComponent(
    `Dear ${row.organization_name} team,\n\n` +
      `Thank you for sharing your details through the Get Listed form on beipoready.com. ` +
      `We have reviewed your submission and would love to walk you through our assessment ` +
      `of your SME IPO eligibility and the clearest path forward.\n\n` +
      `Could you share a convenient time this week for a short call?\n\n` +
      `Warm regards,\nBEIPOREADY Team\n+91 95377 67203 · info@beipoready.com`
  );

  function printCard() {
    const w = window.open("", "_blank", "width=800,height=900");
    if (!w) return;
    const field = (label: string, value: string) =>
      `<tr><td class="l">${label}</td><td>${value}</td></tr>`;
    const yn = (v: boolean | null) => (v === null ? "N/A" : v ? "Yes" : "No");
    w.document.write(`<!doctype html><html><head><title>${row.organization_name}, Eligibility Form</title>
      <link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@600;700&family=Montserrat:wght@400;500&display=swap" rel="stylesheet">
      <style>
        body { font-family: "Montserrat", sans-serif; color: #0D4A6F; padding: 40px; }
        h1 { font-family: "Hanken Grotesk", sans-serif; font-size: 22px; margin: 0 0 2px; }
        .sub { color: #64748b; font-size: 12px; margin-bottom: 24px; }
        table { border-collapse: collapse; width: 100%; font-size: 13px; }
        td { border: 1px solid #e2e8f0; padding: 9px 12px; color: #334155; }
        td.l { width: 42%; color: #64748b; background: #f8fafc; }
        .foot { color: #94a3b8; font-size: 11px; margin-top: 24px; }
      </style></head><body>
      <h1>${row.organization_name}</h1>
      <p class="sub">Get Listed, IPO eligibility submission · ${fmtDate(row.created_at)} · status: ${row.status}</p>
      <table>
        ${field("Email", row.email)}
        ${field("Contact details", row.contact_details ?? "N/A")}
        ${field("Website", row.website ?? "N/A")}
        ${field("Date of incorporation", fmtDate(row.incorporation_date))}
        ${field("Complete years in operation", row.operational_years != null ? String(row.operational_years) : "N/A")}
        ${field("More than 3 years old", yn(row.is_three_years_old))}
        ${field("Operating profit > ₹1 Cr (2 of 3 FYs)", yn(row.has_min_operating_profit))}
        ${field("OFS compliant (≤20% issue / ≤50% holding)", yn(row.ofs_compliant))}
        ${field("Net worth (INR)", fmtInr(row.net_worth))}
        ${field("Paid-up capital (INR)", fmtInr(row.paid_up_capital))}
        ${field("Net tangible assets (INR)", fmtInr(row.net_tangible_assets))}
        ${field("Fund purposes", purposes)}
        ${field("Audited financials uploaded", row.financials_file_path ? "Yes" : "No")}
      </table>
      <p class="foot">BEIPOREADY · Value creation before IPO, wealth creation post listing.</p>
      </body></html>`);
    w.document.close();
    w.focus();
    w.print();
  }

  return (
    <div className="flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-slate-100">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="w-10 h-10 shrink-0 rounded-xl bg-brand-navy/8 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-brand-navy" aria-hidden="true" />
          </div>
          <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold border ${STATUS_COLORS[row.status] ?? STATUS_COLORS.closed}`}>
            {row.status}
          </span>
        </div>
        <h2 className="font-heading text-base font-bold text-brand-navy leading-snug mb-1">
          {row.organization_name}
        </h2>
        <p className="font-sans text-xs text-slate-400 inline-flex items-center gap-1.5">
          <CalendarDays className="w-3 h-3" aria-hidden="true" />
          {fmtDate(row.created_at)}
        </p>
      </div>

      {/* Contact */}
      <div className="px-5 py-3.5 border-b border-slate-100 font-sans text-xs text-slate-600 space-y-1.5">
        <p className="truncate">
          <a href={`mailto:${row.email}`} className="hover:text-brand-gold transition-colors font-medium">{row.email}</a>
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-500">
          {row.contact_details && (
            <span className="inline-flex items-center gap-1">
              <Phone className="w-3 h-3 shrink-0" aria-hidden="true" />{row.contact_details}
            </span>
          )}
          {row.website && (
            <a
              href={row.website.startsWith("http") ? row.website : `https://${row.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-brand-gold transition-colors truncate max-w-[180px]"
            >
              <Globe className="w-3 h-3 shrink-0" aria-hidden="true" />{row.website}
            </a>
          )}
        </div>
      </div>

      {/* Eligibility pills */}
      <div className="px-5 py-3.5 border-b border-slate-100 flex flex-wrap gap-1.5">
        <YesNoPill label="> 3 yrs" value={row.is_three_years_old} />
        <YesNoPill label="EBITDA > ₹1 Cr" value={row.has_min_operating_profit} />
        <YesNoPill label="OFS ok" value={row.ofs_compliant} />
      </div>

      {/* Figures */}
      <div className="px-5 py-4 border-b border-slate-100 flex-1">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3.5 font-sans text-sm">
          <div>
            <dt className="text-[10px] uppercase tracking-wide text-slate-400 mb-0.5">Incorporated</dt>
            <dd className="text-slate-700 font-medium text-[13px]">
              {fmtDate(row.incorporation_date)}
              {row.operational_years != null && (
                <span className="text-slate-400 font-normal"> · {row.operational_years} yrs</span>
              )}
            </dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-wide text-slate-400 mb-0.5">Net worth</dt>
            <dd className="text-slate-700 font-medium text-[13px]">{fmtInr(row.net_worth)}</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-wide text-slate-400 mb-0.5">Paid-up capital</dt>
            <dd className="text-slate-700 font-medium text-[13px]">{fmtInr(row.paid_up_capital)}</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-wide text-slate-400 mb-0.5">Net tangible assets</dt>
            <dd className="text-slate-700 font-medium text-[13px]">{fmtInr(row.net_tangible_assets)}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-[10px] uppercase tracking-wide text-slate-400 mb-0.5">Fund purposes</dt>
            <dd className="text-slate-700 font-medium text-[13px]">{purposes}</dd>
          </div>
        </dl>

        {/* Financials document */}
        {signedUrl && isImage && (
          <a href={signedUrl} target="_blank" rel="noopener noreferrer" className="block mt-4">
            {/* signed URLs are short-lived; next/image optimization would cache/expire them */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={signedUrl}
              alt={`Financial statements uploaded by ${row.organization_name}`}
              className="w-full max-h-32 object-cover rounded-lg border border-slate-200 hover:opacity-90 transition-opacity"
            />
          </a>
        )}
      </div>

      {/* Actions footer */}
      <div className="px-5 py-3.5 bg-slate-50 flex items-center gap-2">
        <a
          href={`mailto:${row.email}?subject=${mailSubject}&body=${mailBody}`}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-brand-navy text-white text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer"
        >
          <Mail className="w-3.5 h-3.5" aria-hidden="true" />
          Email Client
        </a>
        <button
          onClick={printCard}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 text-slate-600 text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Print submission"
        >
          <Printer className="w-3.5 h-3.5" aria-hidden="true" />
          Print
        </button>
        {signedUrl && (
          <a
            href={signedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 text-slate-600 text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Download financials"
          >
            <FileDown className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
        )}
      </div>
    </div>
  );
}
