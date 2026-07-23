"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Send } from "lucide-react";
import EligibilityRail from "@/components/forms/EligibilityRail";
import {
  EMPTY_ANSWERS,
  evaluateEligibility,
  operationalYearsFromDate,
  summarizeExchange,
  type EligibilityAnswers,
  type TrackRecord,
} from "@/lib/eligibility-rules";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

const FUND_OBJECTS = [
  "Capital expenditure / new project",
  "Long-term working capital",
  "Repayment of debt",
  "Acquisition or investment in a subsidiary",
  "Grant of loan",
  "Other",
];

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
const hintCls = "font-sans text-xs text-slate-400 mb-2.5 leading-relaxed";

// ── small field helpers ─────────────────────────────────────────

function YesNo({
  name,
  value,
  onChange,
  labels = ["Yes", "No"],
}: {
  name: string;
  value: boolean | null;
  onChange: (v: boolean) => void;
  labels?: [string, string];
}) {
  return (
    <div className="inline-flex border border-slate-200 rounded-lg p-1 bg-slate-50 gap-1">
      {[true, false].map((v, i) => (
        <label key={String(v)} className="relative cursor-pointer">
          <input
            type="radio"
            name={name}
            checked={value === v}
            onChange={() => onChange(v)}
            className="absolute opacity-0 w-full h-full left-0 top-0 cursor-pointer"
          />
          <span
            className={`block px-5 py-2 rounded-md font-sans text-sm font-semibold transition-colors ${
              value === v ? "bg-white text-brand-navy shadow-sm" : "text-slate-500"
            }`}
          >
            {labels[i]}
          </span>
        </label>
      ))}
    </div>
  );
}

function CrField({
  id,
  label,
  hint,
  value,
  onChange,
}: {
  id: string;
  label: string;
  hint?: string;
  value: number | null;
  onChange: (v: number | null) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelCls}>
        {label}
      </label>
      {hint && <p className={hintCls}>{hint}</p>}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-sans text-xs font-semibold text-slate-400 pointer-events-none">
          ₹ Cr
        </span>
        <input
          id={id}
          type="number"
          step="0.01"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value === "" ? null : parseFloat(e.target.value))}
          placeholder="0.00"
          className={`${inputCls} pl-12`}
        />
      </div>
    </div>
  );
}

type Phase = "form" | "success";

export default function GetListedForm() {
  const [a, setA] = useState<EligibilityAnswers>(EMPTY_ANSWERS);
  const set = <K extends keyof EligibilityAnswers>(key: K, value: EligibilityAnswers[K]) =>
    setA((prev) => ({ ...prev, [key]: value }));

  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [phase, setPhase] = useState<Phase>("form");
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [error, setError] = useState<string | null>(null);

  const results = useMemo(() => evaluateEligibility(a), [a]);
  const nse = useMemo(() => summarizeExchange(results, "nse"), [results]);
  const bse = useMemo(() => summarizeExchange(results, "bse"), [results]);

  const { answered, total } = useMemo(() => {
    const keys: (keyof EligibilityAnswers)[] = [
      "company", "incDate", "converted", "track", "nw1", "nw2", "nta", "opYears", "opLatest",
      "fcfeYears", "leverage", "financeCo", "postCap", "issueSize", "ofsAmt", "sellPct", "gcp",
      "nameChange", "promoterChange", "rejected", "bifr", "winding", "defaults", "pastDefault",
      "regAction", "criminal", "litigation", "rpt", "audited",
    ];
    if (a.track && a.track !== "3plus") {
      keys.push("promoterExp", "appraised");
      if (a.appraised) keys.push("fullFY");
    }
    if (a.nameChange) keys.push("nameRev");
    const ans = keys.filter((k) => {
      const v = a[k];
      return v !== null && v !== "";
    }).length;
    return { answered: ans, total: keys.length };
  }, [a]);

  function toggleObject(o: string) {
    setA((prev) => ({
      ...prev,
      objects: prev.objects.includes(o) ? prev.objects.filter((x) => x !== o) : [...prev.objects, o],
    }));
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

    if (!a.company.trim()) { setError("Company name is required."); return; }
    if (!name.trim()) { setError("Your name is required."); return; }
    if (!EMAIL_RE.test(email.trim())) { setError("Enter a valid email address."); return; }
    if (!phone.trim()) { setError("Mobile number is required."); return; }
    if (!isValidPhone(phone)) { setError("Enter a valid mobile number."); return; }

    setStatus("loading");

    const ofsPct = a.issueSize && a.ofsAmt !== null ? (a.ofsAmt / a.issueSize) * 100 : null;

    const payload = {
      organization_name: a.company.trim(),
      incorporation_date: a.incDate || null,
      operational_years: operationalYearsFromDate(a.incDate),
      is_three_years_old: a.track ? a.track === "3plus" : null,
      has_min_operating_profit: a.opYears !== null ? a.opYears >= 2 : null,
      ofs_compliant: ofsPct !== null ? ofsPct <= 20 && (a.sellPct === null || a.sellPct <= 50) : null,
      net_worth:
        a.nw1 !== null || a.nw2 !== null
          ? `₹${a.nw1 ?? "—"} Cr (latest FY) / ₹${a.nw2 ?? "—"} Cr (prior FY)`
          : null,
      paid_up_capital: a.postCap !== null ? `₹${a.postCap} Cr (post-issue)` : null,
      net_tangible_assets: a.nta !== null ? `₹${a.nta} Cr` : null,
      fund_purposes: a.objects.length ? a.objects : null,
      fund_purpose_other: a.objects.includes("Other") ? a.objectOther.trim() || null : null,
      contact_details: phone.trim(),
      email: email.trim(),
      website: website.trim() || null,
      industry: a.industry.trim() || null,
      designation: designation.trim() || null,
      notes: notes.trim() || null,
      nse_status: nse.status,
      bse_status: bse.status,
      answers: a,
      checks: results,
    };

    const submission = new FormData();
    submission.set("payload", JSON.stringify(payload));
    if (file) submission.set("file", file);

    const response = await fetch("/api/eligibility", { method: "POST", body: submission });

    setStatus("idle");
    if (!response.ok) {
      setError("Something went wrong. Please try again or email us directly.");
      return;
    }
    setPhase("success");
  }

  if (phase === "success") {
    const overall = nse.status === "pass" || bse.status === "pass" || nse.status === "flag" || bse.status === "flag";
    return (
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-brand-gold/15 border border-brand-gold/25 mb-4">
            <Send className="w-6 h-6 text-brand-gold" aria-hidden="true" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-brand-navy mb-2">Details received, thank you!</h2>
          <p className="font-sans text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            {overall
              ? "On the answers you've given, your company clears the published criteria on at least one exchange. Our team will confirm this against your audited records and revert within one business day."
              : "On the answers you've given, some criteria aren't met yet. Most of these are fixable with the right structuring and lead time, our team will review your submission and revert within one business day."}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
          {([["NSE EMERGE", nse], ["BSE SME", bse]] as const).map(([label, v]) => (
            <div
              key={label}
              className={`rounded-xl border p-4 text-center ${
                v.status === "pass" ? "border-emerald-200 bg-emerald-50" :
                v.status === "fail" ? "border-red-200 bg-red-50" :
                v.status === "flag" ? "border-amber-200 bg-amber-50" : "border-slate-200 bg-slate-50"
              }`}
            >
              <p className="font-sans text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</p>
              <p className={`font-heading font-bold mt-1 ${
                v.status === "pass" ? "text-emerald-700" :
                v.status === "fail" ? "text-red-700" :
                v.status === "flag" ? "text-amber-700" : "text-slate-500"
              }`}>
                {v.status === "pass" ? "Criteria met" : v.status === "fail" ? "Not eligible yet" : v.status === "flag" ? "Met, with disclosures" : "Incomplete"}
              </p>
              <p className="font-sans text-xs text-slate-500 mt-1">{v.why}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <Link
            href="/contact-us"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-navy text-white font-semibold rounded-lg text-sm hover:opacity-90 transition-opacity"
          >
            Book a Consultation
          </Link>
          <Link
            href="/ipo-readiness-tool"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-slate-300 text-brand-navy font-semibold rounded-lg text-sm hover:bg-slate-50 transition-colors"
          >
            Take the Readiness Quiz
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
    <form onSubmit={handleSubmit} noValidate className="space-y-5 min-w-0">
      {/* 01 — Company */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8">
        <div className="flex items-baseline gap-3 pb-4 mb-5 border-b border-slate-100">
          <span className="font-sans text-xs font-bold text-brand-gold tracking-widest">01</span>
          <h2 className="font-heading text-lg font-bold text-brand-navy">The company</h2>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="el-company" className={labelCls}>Company name</label>
              <input id="el-company" type="text" value={a.company} onChange={(e) => set("company", e.target.value)} placeholder="ABC Industries Limited" className={inputCls} />
            </div>
            <div>
              <label htmlFor="el-inc" className={labelCls}>Date of incorporation</label>
              <input id="el-inc" type="date" value={a.incDate} onChange={(e) => set("incDate", e.target.value)} className={inputCls} />
            </div>
          </div>

          <div>
            <label htmlFor="el-industry" className={labelCls}>Line of business</label>
            <input id="el-industry" type="text" value={a.industry} onChange={(e) => set("industry", e.target.value)} placeholder="e.g. Speciality chemicals, EPC, textiles" className={inputCls} />
          </div>

          <fieldset>
            <legend className={labelCls}>Was the company formed by converting a proprietorship, partnership firm or LLP?</legend>
            <p className={hintCls}>If yes, the track record of the predecessor firm counts towards the three-year requirement below.</p>
            <YesNo name="converted" value={a.converted} onChange={(v) => set("converted", v)} />
          </fieldset>

          <div>
            <label htmlFor="el-track" className={labelCls}>Track record of operations, including the predecessor firm if any</label>
            <select id="el-track" value={a.track ?? ""} onChange={(e) => set("track", (e.target.value || null) as TrackRecord | null)} className={inputCls}>
              <option value="">Select</option>
              <option value="lt1">Less than 1 full financial year</option>
              <option value="1to2">1 to 2 years</option>
              <option value="2to3">2 to 3 years</option>
              <option value="3plus">3 years or more</option>
            </select>
          </div>

          {a.track && a.track !== "3plus" && (
            <>
              <fieldset>
                <legend className={labelCls}>Do the promoters hold at least 20% of post-issue capital and have 3+ years of experience in the same line of business?</legend>
                <p className={hintCls}>NSE EMERGE accepts the promoters&rsquo; track record in place of the company&rsquo;s own three-year record.</p>
                <YesNo name="promoterExp" value={a.promoterExp} onChange={(v) => set("promoterExp", v)} />
              </fieldset>

              <fieldset>
                <legend className={labelCls}>Is the project you are raising funds for appraised and funded by NABARD, SIDBI, a bank or a financial institution?</legend>
                <p className={hintCls}>This is BSE SME&rsquo;s alternative route for companies without a three-year record. Co-operative banks do not qualify.</p>
                <YesNo name="appraised" value={a.appraised} onChange={(v) => set("appraised", v)} />
                {a.appraised && (
                  <div className="mt-4 pl-4 border-l-2 border-brand-gold">
                    <p className={labelCls}>Do you have at least one full financial year of operations and audited results for that year?</p>
                    <YesNo name="fullFY" value={a.fullFY} onChange={(v) => set("fullFY", v)} />
                  </div>
                )}
              </fieldset>
            </>
          )}

          <fieldset>
            <legend className={labelCls}>Has the company changed its name in the last one year?</legend>
            <YesNo name="nameChange" value={a.nameChange} onChange={(v) => set("nameChange", v)} />
            {a.nameChange && (
              <div className="mt-4 pl-4 border-l-2 border-brand-gold">
                <p className={labelCls}>Did the new-name activity earn at least 50% of restated consolidated revenue in the preceding full financial year?</p>
                <YesNo name="nameRev" value={a.nameRev} onChange={(v) => set("nameRev", v)} />
              </div>
            )}
          </fieldset>

          <fieldset>
            <legend className={labelCls}>Has there been any change in promoters in the last one year?</legend>
            <p className={hintCls}>BSE SME requires promoters to be unchanged for one year before the listing application.</p>
            <YesNo name="promoterChange" value={a.promoterChange} onChange={(v) => set("promoterChange", v)} />
          </fieldset>
        </div>
      </div>

      {/* 02 — Financials */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8">
        <div className="flex items-baseline gap-3 pb-4 mb-5 border-b border-slate-100">
          <span className="font-sans text-xs font-bold text-brand-gold tracking-widest">02</span>
          <h2 className="font-heading text-lg font-bold text-brand-navy">Financials</h2>
        </div>

        <div className="space-y-6">
          <div>
            <p className={labelCls}>Net worth for the two preceding full financial years</p>
            <p className={hintCls}>Both exchanges require positive net worth of at least ₹1 Cr in each of the last two full years.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <CrField id="el-nw1" label="Latest full FY" value={a.nw1} onChange={(v) => set("nw1", v)} />
              <CrField id="el-nw2" label="Year before that" value={a.nw2} onChange={(v) => set("nw2", v)} />
            </div>
          </div>

          <CrField id="el-nta" label="Net tangible assets — latest full financial year" hint="BSE SME requires ₹3 Cr. NSE EMERGE has no net tangible asset condition." value={a.nta} onChange={(v) => set("nta", v)} />

          <div>
            <label htmlFor="el-opyears" className={labelCls}>In how many of the last 3 financial years was operating profit (EBDT) from operations at least ₹1 Cr?</label>
            <p className={hintCls}>Earnings before interest, depreciation and tax, from operations, restated and consolidated.</p>
            <select id="el-opyears" value={a.opYears ?? ""} onChange={(e) => set("opYears", e.target.value === "" ? null : parseInt(e.target.value, 10))} className={inputCls}>
              <option value="">Select</option>
              <option value="0">None</option>
              <option value="1">1 of 3 years</option>
              <option value="2">2 of 3 years</option>
              <option value="3">All 3 years</option>
            </select>
          </div>

          <fieldset>
            <legend className={labelCls}>Did the company post an operating profit in the most recent full financial year?</legend>
            <p className={hintCls}>BSE SME requires operating profit for the one full year immediately preceding the application.</p>
            <YesNo name="opLatest" value={a.opLatest} onChange={(v) => set("opLatest", v)} />
          </fieldset>

          <div>
            <label htmlFor="el-fcfe" className={labelCls}>In how many of the last 3 financial years did the company have positive Free Cash Flow to Equity (FCFE)?</label>
            <p className={hintCls}>NSE EMERGE requires FCFE in at least 2 of the last 3 years. BSE SME does not test this.</p>
            <select id="el-fcfe" value={a.fcfeYears ?? ""} onChange={(e) => set("fcfeYears", e.target.value === "" ? null : parseInt(e.target.value, 10))} className={inputCls}>
              <option value="">Select</option>
              <option value="0">None</option>
              <option value="1">1 of 3 years</option>
              <option value="2">2 of 3 years</option>
              <option value="3">All 3 years</option>
            </select>
          </div>

          <div>
            <p className={labelCls}>Leverage ratio (total debt ÷ equity) as per the latest audited accounts</p>
            <p className={hintCls}>BSE SME caps this at 3:1. Enter <span className="font-semibold">3</span> for 3:1. Finance companies may be granted relaxation.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <input type="number" step="0.01" value={a.leverage ?? ""} onChange={(e) => set("leverage", e.target.value === "" ? null : parseFloat(e.target.value))} placeholder="e.g. 1.20" className={inputCls} aria-label="Leverage ratio" />
              <fieldset>
                <legend className="font-sans text-xs text-slate-500 mb-1.5">Is this a finance company?</legend>
                <YesNo name="financeCo" value={a.financeCo} onChange={(v) => set("financeCo", v)} />
              </fieldset>
            </div>
          </div>
        </div>
      </div>

      {/* 03 — Proposed issue */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8">
        <div className="flex items-baseline gap-3 pb-4 mb-5 border-b border-slate-100">
          <span className="font-sans text-xs font-bold text-brand-gold tracking-widest">03</span>
          <h2 className="font-heading text-lg font-bold text-brand-navy">The proposed issue</h2>
        </div>

        <div className="space-y-6">
          <CrField id="el-postcap" label="Expected post-issue paid-up equity capital" hint="The SME platform is for companies with post-issue capital between ₹1 Cr and ₹25 Cr. Above ₹25 Cr, you are looking at a Mainboard IPO." value={a.postCap} onChange={(v) => set("postCap", v)} />

          <div>
            <p className={labelCls}>Proposed issue size and offer for sale</p>
            <p className={hintCls}>OFS cannot exceed 20% of the total issue size.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <CrField id="el-issuesize" label="Total issue size" value={a.issueSize} onChange={(v) => set("issueSize", v)} />
              <CrField id="el-ofs" label="Of which, offer for sale" value={a.ofsAmt} onChange={(v) => set("ofsAmt", v)} />
            </div>
          </div>

          <div>
            <label htmlFor="el-sellpct" className={labelCls}>What is the largest share of any selling shareholder&rsquo;s holding being offered?</label>
            <p className={hintCls}>A selling shareholder cannot offer more than 50% of their holding. Enter the highest percentage across all selling shareholders.</p>
            <input id="el-sellpct" type="number" step="0.1" min="0" max="100" value={a.sellPct ?? ""} onChange={(e) => set("sellPct", e.target.value === "" ? null : parseFloat(e.target.value))} placeholder="e.g. 30" className={inputCls} />
          </div>

          <CrField id="el-gcp" label="Amount earmarked for General Corporate Purposes" hint="Capped at 15% of the amount raised or ₹10 Cr, whichever is lower." value={a.gcp} onChange={(v) => set("gcp", v)} />

          <fieldset>
            <legend className={labelCls}>What will the rest of the proceeds be used for?</legend>
            <p className={hintCls}>Select all that apply.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {FUND_OBJECTS.map((o) => (
                <label key={o} className="inline-flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={a.objects.includes(o)} onChange={() => toggleObject(o)} className="w-4 h-4 rounded accent-[#0F2D52] cursor-pointer" />
                  <span className="font-sans text-sm text-slate-700">{o}</span>
                </label>
              ))}
            </div>
            {a.objects.includes("Other") && (
              <input type="text" value={a.objectOther} onChange={(e) => set("objectOther", e.target.value)} placeholder="Please specify…" className={`${inputCls} mt-3`} aria-label="Other objective" />
            )}
          </fieldset>
        </div>
      </div>

      {/* 04 — Compliance */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8">
        <div className="flex items-baseline gap-3 pb-4 mb-5 border-b border-slate-100">
          <span className="font-sans text-xs font-bold text-brand-gold tracking-widest">04</span>
          <h2 className="font-heading text-lg font-bold text-brand-navy">Compliance and disclosures</h2>
        </div>

        <div className="space-y-6">
          <fieldset>
            <legend className={labelCls}>Has any listing application of the company been rejected by an exchange in the last 6 complete months?</legend>
            <YesNo name="rejected" value={a.rejected} onChange={(v) => set("rejected", v)} />
          </fieldset>

          <fieldset>
            <legend className={labelCls}>Has the company or any promoting company been referred to BIFR, or had proceedings admitted under the Insolvency and Bankruptcy Code?</legend>
            <YesNo name="bifr" value={a.bifr} onChange={(v) => set("bifr", v)} />
          </fieldset>

          <fieldset>
            <legend className={labelCls}>Has any winding-up petition against the company been admitted by the NCLT or a court?</legend>
            <YesNo name="winding" value={a.winding} onChange={(v) => set("winding", v)} />
          </fieldset>

          <fieldset>
            <legend className={labelCls}>Are there any pending defaults on interest or principal to debenture, bond or fixed deposit holders?</legend>
            <YesNo name="defaults" value={a.defaults} onChange={(v) => set("defaults", v)} />
          </fieldset>

          <fieldset>
            <legend className={labelCls}>In the past 3 years, has there been any default to banks or financial institutions by the company, promoters or group companies?</legend>
            <p className={hintCls}>Past, settled defaults do not bar a listing, but they must be disclosed.</p>
            <YesNo name="pastDefault" value={a.pastDefault} onChange={(v) => set("pastDefault", v)} />
          </fieldset>

          <fieldset>
            <legend className={labelCls}>In the past one year, has any exchange or regulator taken material regulatory action against the promoters or group companies?</legend>
            <YesNo name="regAction" value={a.regAction} onChange={(v) => set("regAction", v)} />
          </fieldset>

          <fieldset>
            <legend className={labelCls}>Is any director charge-sheeted with a serious offence such as forgery or an economic offence, or under investigation?</legend>
            <YesNo name="criminal" value={a.criminal} onChange={(v) => set("criminal", v)} />
          </fieldset>

          <fieldset>
            <legend className={labelCls}>Are there material litigations involving the company, its promoters or group companies?</legend>
            <YesNo name="litigation" value={a.litigation} onChange={(v) => set("litigation", v)} />
          </fieldset>

          <fieldset>
            <legend className={labelCls}>Can the company adopt Mainboard-level related party transaction norms, with materiality set at 10% of consolidated turnover or ₹50 Cr, whichever is lower?</legend>
            <p className={hintCls}>These now apply to SME-listed entities as well.</p>
            <YesNo name="rpt" value={a.rpt} onChange={(v) => set("rpt", v)} labels={["Yes", "Not sure"]} />
          </fieldset>

          <fieldset>
            <legend className={labelCls}>Are audited financial statements for the last 3 years, restated and consolidated, available?</legend>
            <YesNo name="audited" value={a.audited} onChange={(v) => set("audited", v)} />
          </fieldset>
        </div>
      </div>

      {/* 05 — Contact */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8">
        <div className="flex items-baseline gap-3 pb-4 mb-5 border-b border-slate-100">
          <span className="font-sans text-xs font-bold text-brand-gold tracking-widest">05</span>
          <h2 className="font-heading text-lg font-bold text-brand-navy">Where should we send the assessment?</h2>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="el-name" className={labelCls}>Your name</label>
              <input id="el-name" type="text" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className={inputCls} />
            </div>
            <div>
              <label htmlFor="el-designation" className={labelCls}>Designation</label>
              <input id="el-designation" type="text" value={designation} onChange={(e) => setDesignation(e.target.value)} placeholder="Promoter / CFO / Company Secretary" className={inputCls} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="el-email" className={labelCls}>Email</label>
              <input id="el-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className={inputCls} />
            </div>
            <div>
              <label htmlFor="el-phone" className={labelCls}>Mobile</label>
              <input id="el-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" placeholder="+91" className={inputCls} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="el-website" className={labelCls}>Company&rsquo;s website</label>
              <input id="el-website" type="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://" autoComplete="url" className={inputCls} />
            </div>
            <div>
              <label htmlFor="el-file" className={labelCls}>
                Audited financial statements
                <span className="ml-2 font-normal text-slate-400">PDF / Excel / ZIP, max 10 MB</span>
              </label>
              <input
                id="el-file"
                type="file"
                accept=".pdf,.xls,.xlsx,.jpg,.jpeg,.png,.zip"
                onChange={onFileChange}
                className="w-full font-sans text-sm text-slate-600 file:mr-3 file:px-4 file:py-2.5 file:rounded-lg file:border-0 file:bg-brand-navy/8 file:text-brand-navy file:text-sm file:font-semibold file:cursor-pointer cursor-pointer"
              />
            </div>
          </div>
          <div>
            <label htmlFor="el-notes" className={labelCls}>Anything else we should know?</label>
            <input id="el-notes" type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Timelines, prior filings, existing investors…" className={inputCls} />
          </div>

          {error && (
            <p className="font-sans text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5" role="alert">
              {error}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-10 py-3 bg-brand-navy text-white font-semibold rounded-lg text-sm hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
            >
              {status === "loading" ? "Submitting…" : "Send to our team"}
            </button>
            <p className="font-sans text-xs text-slate-400 max-w-xs">
              Your responses stay confidential and are used only to assess your listing readiness.
            </p>
          </div>
        </div>
      </div>
    </form>

    <aside className="lg:pt-0">
      <EligibilityRail results={results} answered={answered} total={total} />
    </aside>
    </div>
  );
}

export { EMPTY_ANSWERS };
