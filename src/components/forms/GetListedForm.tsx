"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FUND_PURPOSES = ["Expansion", "Working Capital", "Debt Repayment", "Other"];

const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "image/jpeg",
  "image/png",
  "application/zip",
];
const MAX_FILE_BYTES = 10 * 1024 * 1024; // must match the bucket limit

const inputCls =
  "w-full px-4 py-3 border border-slate-300 rounded-lg font-sans text-sm placeholder:text-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold";
const labelCls = "block font-sans text-sm font-medium text-slate-700 mb-1.5";

function YesNo({
  name,
  value,
  onChange,
}: {
  name: string;
  value: boolean | null;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-6">
      {[true, false].map((v) => (
        <label key={String(v)} className="inline-flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name={name}
            checked={value === v}
            onChange={() => onChange(v)}
            className="w-4 h-4 accent-[#0D4A6F] cursor-pointer"
          />
          <span className="font-sans text-sm text-slate-700">{v ? "Yes" : "No"}</span>
        </label>
      ))}
    </div>
  );
}

export default function GetListedForm() {
  const [org, setOrg] = useState("");
  const [incorporationDate, setIncorporationDate] = useState("");
  const [operationalYears, setOperationalYears] = useState("");
  const [threeYears, setThreeYears] = useState<boolean | null>(null);
  const [minProfit, setMinProfit] = useState<boolean | null>(null);
  const [ofs, setOfs] = useState<boolean | null>(null);
  const [netWorth, setNetWorth] = useState("");
  const [paidUp, setPaidUp] = useState("");
  const [netTangible, setNetTangible] = useState("");
  const [purposes, setPurposes] = useState<string[]>([]);
  const [purposeOther, setPurposeOther] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");

  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [error, setError] = useState<string | null>(null);

  function togglePurpose(p: string) {
    setPurposes((cur) => (cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p]));
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    if (f && f.size > MAX_FILE_BYTES) {
      setError("File is too large, please keep it under 10 MB.");
      e.target.value = "";
      setFile(null);
      return;
    }
    if (f && !ACCEPTED_FILE_TYPES.includes(f.type)) {
      setError("Please upload a PDF, Excel, image, or ZIP file.");
      e.target.value = "";
      setFile(null);
      return;
    }
    setError(null);
    setFile(f);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!org.trim()) { setError("Name of the organization is required."); return; }
    if (!EMAIL_RE.test(email.trim())) { setError("Enter a valid email address."); return; }

    setStatus("loading");
    const supabase = createClient();

    // Upload the financial statements first (if provided)
    let filePath: string | null = null;
    if (file) {
      const safeName = file.name.replace(/[^\w.\-]+/g, "_");
      filePath = `${crypto.randomUUID()}/${safeName}`;
      const { error: uploadError } = await supabase.storage
        .from("eligibility-docs")
        .upload(filePath, file, { contentType: file.type });
      if (uploadError) {
        setError("Could not upload the file. Please try again, or submit without it.");
        setStatus("idle");
        return;
      }
    }

    // No .select() after .insert(); anon visitors can submit but cannot read.
    const { error: insertError } = await supabase.from("eligibility_submissions").insert({
      organization_name: org.trim(),
      incorporation_date: incorporationDate || null,
      operational_years: operationalYears ? parseInt(operationalYears, 10) : null,
      is_three_years_old: threeYears,
      has_min_operating_profit: minProfit,
      ofs_compliant: ofs,
      net_worth: netWorth.trim() || null,
      paid_up_capital: paidUp.trim() || null,
      net_tangible_assets: netTangible.trim() || null,
      fund_purposes: purposes.length ? purposes : null,
      fund_purpose_other: purposes.includes("Other") ? purposeOther.trim() || null : null,
      financials_file_path: filePath,
      contact_details: contact.trim() || null,
      email: email.trim(),
      website: website.trim() || null,
    });

    if (insertError) {
      setError("Something went wrong. Please try again or email us directly.");
      setStatus("idle");
      return;
    }
    setStatus("success");
  }

  if (status === "success") {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-10 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-brand-gold/15 border border-brand-gold/25 mb-4">
          <Send className="w-6 h-6 text-brand-gold" aria-hidden="true" />
        </div>
        <h2 className="font-heading text-xl font-bold text-brand-navy mb-2">
          Details received, thank you!
        </h2>
        <p className="font-sans text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          Our team will review your eligibility and get back to you within one
          business day with an honest assessment of where you stand.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-heading text-2xl font-bold text-brand-navy">Send us your details</h2>
        <Send className="w-7 h-7 text-slate-300 -rotate-12" aria-hidden="true" />
      </div>

      <div className="space-y-6">
        {/* Organization */}
        <div>
          <label htmlFor="gl-org" className="sr-only">Name of the Organization</label>
          <input id="gl-org" type="text" value={org} onChange={(e) => setOrg(e.target.value)} placeholder="Name of the Organization *" className={inputCls} />
        </div>

        {/* Incorporation date + operational years */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="gl-date" className={labelCls}>
              What is the exact date of incorporation of your company?
            </label>
            <input id="gl-date" type="date" value={incorporationDate} onChange={(e) => setIncorporationDate(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label htmlFor="gl-years" className={labelCls}>
              How many complete years has your company been in operation?
            </label>
            <input id="gl-years" type="number" min="0" value={operationalYears} onChange={(e) => setOperationalYears(e.target.value)} placeholder="Operational Years" className={inputCls} />
          </div>
        </div>

        {/* Yes/No checks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <fieldset>
            <legend className={labelCls}>Is your company more than 3 years old?</legend>
            <YesNo name="gl-three-years" value={threeYears} onChange={setThreeYears} />
          </fieldset>
          <fieldset>
            <legend className={labelCls}>
              Is your operating profit (earnings before interest, depreciation and
              tax) more than ₹1 Crore from operations for any 2 out of 3 previous
              financial years?
            </legend>
            <YesNo name="gl-min-profit" value={minProfit} onChange={setMinProfit} />
          </fieldset>
        </div>

        <fieldset>
          <legend className={labelCls}>
            Offer for sale (OFS) by selling shareholders in an SME IPO shall not
            exceed 20% of the total issue size, and selling shareholders cannot
            sell more than 50% of their holding. Does your plan comply?
          </legend>
          <YesNo name="gl-ofs" value={ofs} onChange={setOfs} />
        </fieldset>

        {/* Financial figures */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="gl-networth" className={labelCls}>
              What is the current net worth of your company as per the latest
              audited financial statements? (in INR)
            </label>
            <input id="gl-networth" type="text" value={netWorth} onChange={(e) => setNetWorth(e.target.value)} placeholder="Net Worth" className={inputCls} />
          </div>
          <div>
            <label htmlFor="gl-paidup" className={labelCls}>
              What is the current paid-up capital of your company as per the
              latest audited financial statements? (in INR)
            </label>
            <input id="gl-paidup" type="text" value={paidUp} onChange={(e) => setPaidUp(e.target.value)} placeholder="Paid-up Capital" className={inputCls} />
          </div>
          <div>
            <label htmlFor="gl-tangible" className={labelCls}>
              What is the current value of net tangible assets of your company as
              per the latest audited financial statements? (in INR)
            </label>
            <input id="gl-tangible" type="text" value={netTangible} onChange={(e) => setNetTangible(e.target.value)} placeholder="Net Tangible Assets" className={inputCls} />
          </div>
          <fieldset>
            <legend className={labelCls}>
              What is the primary purpose for which the funds raised from the IPO
              will be utilized?
            </legend>
            <div className="flex flex-wrap gap-x-5 gap-y-2 mt-1">
              {FUND_PURPOSES.map((p) => (
                <label key={p} className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={purposes.includes(p)}
                    onChange={() => togglePurpose(p)}
                    className="w-4 h-4 rounded accent-[#0D4A6F] cursor-pointer"
                  />
                  <span className="font-sans text-sm text-slate-700">
                    {p === "Other" ? "Other (please specify)" : p}
                  </span>
                </label>
              ))}
            </div>
            {purposes.includes("Other") && (
              <input
                aria-label="Other purpose"
                type="text"
                value={purposeOther}
                onChange={(e) => setPurposeOther(e.target.value)}
                placeholder="Please specify…"
                className={`${inputCls} mt-3`}
              />
            )}
          </fieldset>
        </div>

        {/* File + contact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="gl-file" className={labelCls}>
              Audited Financial Statements
              <span className="ml-2 font-normal text-slate-400">PDF / Excel / ZIP, max 10 MB</span>
            </label>
            <input
              id="gl-file"
              type="file"
              accept=".pdf,.xls,.xlsx,.jpg,.jpeg,.png,.zip"
              onChange={onFileChange}
              className="w-full font-sans text-sm text-slate-600 file:mr-3 file:px-4 file:py-2.5 file:rounded-lg file:border-0 file:bg-brand-navy/8 file:text-brand-navy file:text-sm file:font-semibold file:cursor-pointer cursor-pointer"
            />
          </div>
          <div>
            <label htmlFor="gl-contact" className="sr-only">Contact details</label>
            <input id="gl-contact" type="tel" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Contact Details" className={`${inputCls} sm:mt-7`} autoComplete="tel" />
          </div>
          <div>
            <label htmlFor="gl-email" className="sr-only">Email</label>
            <input id="gl-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email *" className={inputCls} autoComplete="email" />
          </div>
          <div>
            <label htmlFor="gl-website" className="sr-only">Company&rsquo;s website</label>
            <input id="gl-website" type="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="Company's website" className={inputCls} autoComplete="url" />
          </div>
        </div>

        {error && (
          <p className="font-sans text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="px-10 py-3 bg-brand-navy text-white font-semibold rounded-lg text-sm hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
        >
          {status === "loading" ? "Submitting…" : "Submit"}
        </button>
      </div>
    </form>
  );
}
