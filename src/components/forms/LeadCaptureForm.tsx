"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { LeadSource } from "@/types";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import SelectField from "./_SelectField";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SERVICE_OPTIONS = [
  { value: "Fundraising & Growth Capital",  label: "Fundraising & Growth Capital" },
  { value: "Pre-IPO Advisory",              label: "Pre-IPO Advisory" },
  { value: "IPO Advisory",                  label: "IPO Advisory" },
  { value: "Corporate Advisory & Valuation", label: "Corporate Advisory & Valuation" },
  { value: "Not sure yet",                  label: "Not sure yet" },
];

interface FormValues {
  name: string;
  email: string;
  phone: string;
  service_interest: string;
  message: string;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

interface LeadCaptureFormProps {
  source: LeadSource;
  /** Optional heading rendered above the form */
  heading?: string;
  /** Optional subtext rendered below the heading */
  description?: string;
  /** Override the submit button label */
  submitLabel?: string;
}

function validate(v: FormValues): FormErrors {
  const errs: FormErrors = {};
  if (!v.name.trim())            errs.name  = "Name is required.";
  if (!v.email.trim())           errs.email = "Email is required.";
  else if (!EMAIL_RE.test(v.email.trim())) errs.email = "Enter a valid email address.";
  return errs;
}

/* ── Success card shown after a successful submit ── */
function SuccessCard() {
  return (
    <div className="flex flex-col items-center text-center gap-4 py-8 px-4">
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-brand-gold/15 border border-brand-gold/30">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 13l4 4L19 7" stroke="#EAAF47" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div>
        <p className="font-heading text-lg font-bold text-brand-navy mb-1">
          We&rsquo;ll be in touch shortly!
        </p>
        <p className="font-sans text-sm text-slate-500 leading-relaxed">
          Thank you for reaching out. One of our advisors will contact you within one business day.
        </p>
      </div>
    </div>
  );
}

export default function LeadCaptureForm({
  source,
  heading,
  description,
  submitLabel = "Get in Touch",
}: LeadCaptureFormProps) {
  const [values, setValues] = useState<FormValues>({
    name: "",
    email: "",
    phone: "",
    service_interest: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [apiError, setApiError] = useState<string | null>(null);

  function set(field: keyof FormValues, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError(null);

    const errs = validate(values);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setStatus("loading");

    const supabase = createClient();
    // No .select() after .insert(); anon visitors can submit leads but cannot read them.
    const { error } = await supabase.from("leads").insert({
      name:             values.name.trim(),
      email:            values.email.trim(),
      phone:            values.phone.trim()            || null,
      service_interest: values.service_interest        || null,
      message:          values.message.trim()          || null,
      source,
    });

    if (error) {
      setApiError("Something went wrong. Please try again or email us directly.");
      setStatus("idle");
      return;
    }

    setStatus("success");
  }

  if (status === "success") return <SuccessCard />;

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {heading && (
        <div className="mb-1">
          <h3 className="font-heading text-xl font-bold text-brand-navy">{heading}</h3>
          {description && (
            <p className="font-sans text-sm text-slate-500 mt-1 leading-relaxed">{description}</p>
          )}
        </div>
      )}

      {/* Row 1 — Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="lcf-name"
          label="Name *"
          type="text"
          placeholder="Rahul Sharma"
          value={values.name}
          onChange={(e) => set("name", e.target.value)}
          error={errors.name}
          autoComplete="name"
        />
        <Input
          id="lcf-email"
          label="Email *"
          type="email"
          placeholder="rahul@company.com"
          value={values.email}
          onChange={(e) => set("email", e.target.value)}
          error={errors.email}
          autoComplete="email"
        />
      </div>

      {/* Row 2 — Phone + Service Interest */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="lcf-phone"
          label="Phone (optional)"
          type="tel"
          placeholder="+91 98765 43210"
          value={values.phone}
          onChange={(e) => set("phone", e.target.value)}
          autoComplete="tel"
        />
        <SelectField
          id="lcf-service"
          label="Service Interest (optional)"
          value={values.service_interest}
          onChange={(v) => set("service_interest", v)}
          options={SERVICE_OPTIONS}
          placeholder="Select a service…"
        />
      </div>

      {/* Row 3 — Message */}
      <Textarea
        id="lcf-message"
        label="Message (optional)"
        placeholder="Tell us about your company and what you're looking to achieve…"
        rows={4}
        value={values.message}
        onChange={(e) => set("message", e.target.value)}
      />

      {/* API error */}
      {apiError && (
        <p className="font-sans text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5" role="alert">
          {apiError}
        </p>
      )}

      <Button
        type="submit"
        variant="primary"
        size="md"
        disabled={status === "loading"}
        className="self-start"
      >
        {status === "loading" ? "Submitting…" : submitLabel}
      </Button>
    </form>
  );
}
