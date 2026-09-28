"use client";

import { useEffect, useState } from "react";
import { submitLead } from "@/lib/submit-lead";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import SelectField from "./_SelectField";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESEND_COOLDOWN_SECONDS = 45;

type OtpStatus = "idle" | "sending" | "sent" | "verifying" | "verified";

function isValidPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

const SERVICE_OPTIONS = [
  { value: "SME IPO Advisory",                      label: "SME IPO Advisory" },
  { value: "IPO Readiness Assessment",               label: "IPO Readiness Assessment" },
  { value: "Pre-IPO Fundraising",                    label: "Pre-IPO Fundraising" },
  { value: "IPO Documentation & Compliance Support", label: "IPO Documentation & Compliance Support" },
  { value: "Valuation & Capital Structuring",        label: "Valuation & Capital Structuring" },
];

interface FormValues {
  name: string;
  email: string;
  phone: string;
  company_name: string;
  service_interest: string;
  message: string;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

function validate(v: FormValues): FormErrors {
  const errs: FormErrors = {};
  if (!v.name.trim())    errs.name    = "Name is required.";
  if (!v.email.trim())   errs.email   = "Email is required.";
  else if (!EMAIL_RE.test(v.email.trim())) errs.email = "Enter a valid email address.";
  if (!v.phone.trim())   errs.phone   = "Phone number is required.";
  else if (!isValidPhone(v.phone)) errs.phone = "Enter a valid phone number.";
  if (!v.message.trim()) errs.message = "Please include a message so we can best help you.";
  return errs;
}

function SuccessCard() {
  return (
    <div className="flex flex-col items-center text-center gap-4 py-12 px-6">
      <div className="w-14 h-14 flex items-center justify-center rounded-full bg-brand-gold/15 border border-brand-gold/30">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <path d="M6 15l5 5L22 8" stroke="#EAAF47" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div>
        <p className="font-heading text-2xl font-bold text-brand-navy mb-2">
          Message received!
        </p>
        <p className="font-sans text-base text-slate-500 leading-relaxed max-w-md">
          Thank you for getting in touch. One of our advisors will review your enquiry and
          respond within one business day.
        </p>
      </div>
    </div>
  );
}

export default function ContactForm() {
  const [values, setValues] = useState<FormValues>({
    name: "",
    email: "",
    phone: "",
    company_name: "",
    service_interest: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [apiError, setApiError] = useState<string | null>(null);

  const [otpStatus, setOtpStatus] = useState<OtpStatus>("idle");
  const [otpCode, setOtpCode] = useState("");
  const [otpToken, setOtpToken] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);
  const [resendIn, setResendIn] = useState(0);

  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = setInterval(() => setResendIn((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timer);
  }, [resendIn]);

  function set(field: keyof FormValues, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));

    if (field === "email") {
      // Any edit after verifying invalidates the previous verification.
      if (otpStatus !== "idle") {
        setOtpStatus("idle");
        setOtpCode("");
        setOtpToken(null);
        setOtpError(null);
        setVerifiedEmail(null);
      }
    }
  }

  async function handleSendOtp() {
    const email = values.email.trim();
    if (!email || !EMAIL_RE.test(email)) {
      setErrors((e) => ({ ...e, email: "Enter a valid email address." }));
      return;
    }

    setOtpError(null);
    setOtpStatus("sending");

    try {
      const response = await fetch("/api/contact/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setOtpError(data.error || "Could not send a verification code. Please try again.");
        setOtpStatus("idle");
        return;
      }

      setOtpStatus("sent");
      setResendIn(RESEND_COOLDOWN_SECONDS);
    } catch {
      setOtpError("Could not send a verification code. Please try again.");
      setOtpStatus("idle");
    }
  }

  async function handleVerifyOtp() {
    const email = values.email.trim();
    if (!/^\d{6}$/.test(otpCode)) {
      setOtpError("Enter the 6-digit code sent to your email.");
      return;
    }

    setOtpError(null);
    setOtpStatus("verifying");

    try {
      const response = await fetch("/api/contact/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otpCode }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setOtpError(data.error || "Could not verify the code. Please try again.");
        setOtpStatus("sent");
        return;
      }

      setOtpToken(data.token);
      setVerifiedEmail(email);
      setOtpStatus("verified");
    } catch {
      setOtpError("Could not verify the code. Please try again.");
      setOtpStatus("sent");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError(null);

    const errs = validate(values);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    if (otpStatus !== "verified" || !otpToken || verifiedEmail !== values.email.trim()) {
      setOtpError((current) => current ?? "Please verify your email before submitting.");
      return;
    }

    setStatus("loading");

    const ok = await submitLead({
      name:             values.name.trim(),
      email:            values.email.trim(),
      phone:            values.phone.trim(),
      company_name:     values.company_name.trim()     || null,
      service_interest: values.service_interest        || null,
      message:          values.message.trim(),
      source:           "contact",
      otp_token:        otpToken,
    });

    if (!ok) {
      setApiError("Something went wrong. Please try again or email us directly at info@beipoready.com.");
      setStatus("idle");
      return;
    }

    setStatus("success");
  }

  if (status === "success") return <SuccessCard />;

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

      {/* Row 1, Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          id="cf-name"
          label="Name *"
          type="text"
          placeholder="Rahul Sharma"
          value={values.name}
          onChange={(e) => set("name", e.target.value)}
          error={errors.name}
          autoComplete="name"
        />
        <Input
          id="cf-email"
          label="Email *"
          type="email"
          placeholder="rahul@company.com"
          value={values.email}
          onChange={(e) => set("email", e.target.value)}
          error={errors.email}
          autoComplete="email"
        />
      </div>

      {/* Email OTP verification */}
      <div className="flex flex-col gap-2 -mt-2">
        {otpStatus === "verified" ? (
          <p className="font-sans text-sm text-emerald-600 flex items-center gap-1.5">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Email verified
          </p>
        ) : otpStatus === "sent" || otpStatus === "verifying" ? (
          <div className="flex flex-col sm:flex-row sm:items-end gap-3">
            <div className="flex-1">
              <Input
                id="cf-otp"
                label="Enter the 6-digit code we emailed you *"
                type="text"
                inputMode="numeric"
                placeholder="123456"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              />
            </div>
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={handleVerifyOtp}
              disabled={otpStatus === "verifying" || otpCode.length !== 6}
            >
              {otpStatus === "verifying" ? "Verifying…" : "Verify"}
            </Button>
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={resendIn > 0 || otpStatus === "verifying"}
              className="font-sans text-sm text-brand-navy underline-offset-4 hover:underline disabled:opacity-50 disabled:no-underline whitespace-nowrap pb-2.5"
            >
              {resendIn > 0 ? `Resend code (${resendIn}s)` : "Resend code"}
            </button>
          </div>
        ) : (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleSendOtp}
            disabled={otpStatus === "sending" || !values.email.trim()}
            className="self-start"
          >
            {otpStatus === "sending" ? "Sending code…" : "Verify Email"}
          </Button>
        )}
        {otpError && (
          <p className="font-sans text-xs text-red-500" role="alert">
            {otpError}
          </p>
        )}
      </div>

      {/* Row 2, Company + Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          id="cf-company"
          label="Company Name (optional)"
          type="text"
          placeholder="Acme Precision Parts Ltd."
          value={values.company_name}
          onChange={(e) => set("company_name", e.target.value)}
          autoComplete="organization"
        />
        <Input
          id="cf-phone"
          label="Phone *"
          type="tel"
          placeholder="+91 98765 43210"
          value={values.phone}
          onChange={(e) => set("phone", e.target.value)}
          error={errors.phone}
          autoComplete="tel"
        />
      </div>

      {/* Row 3, Service Interest */}
      <SelectField
        id="cf-service"
        label="Service Interest (optional)"
        value={values.service_interest}
        onChange={(v) => set("service_interest", v)}
        options={SERVICE_OPTIONS}
        placeholder="Which service are you enquiring about?"
      />

      {/* Row 4, Message (required) */}
      <Textarea
        id="cf-message"
        label="Message *"
        placeholder="Tell us about your company, your current stage, and what you'd like to achieve…"
        rows={6}
        value={values.message}
        onChange={(e) => set("message", e.target.value)}
        error={errors.message}
      />

      {/* API error */}
      {apiError && (
        <p
          className="font-sans text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3"
          role="alert"
        >
          {apiError}
        </p>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={status === "loading" || otpStatus !== "verified"}
      >
        {status === "loading" ? "Sending…" : otpStatus !== "verified" ? "Verify your email to continue" : "Send Message"}
      </Button>

    </form>
  );
}
