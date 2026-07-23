"use client";

import { useState } from "react";
import { submitLead } from "@/lib/submit-lead";
import Button from "@/components/ui/Button";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function NewsletterForm() {
  const [email, setEmail]     = useState("");
  const [error, setError]     = useState<string | null>(null);
  const [status, setStatus]   = useState<"idle" | "loading" | "success">("idle");
  const [apiError, setApiError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setApiError(null);

    const trimmed = email.trim();
    if (!trimmed)                  { setError("Email is required.");             return; }
    if (!EMAIL_RE.test(trimmed))   { setError("Enter a valid email address.");   return; }

    setStatus("loading");

    // name is required; placeholder used for newsletter signups.
    const ok = await submitLead({
      name:   "Newsletter Subscriber",
      email:  trimmed,
      source: "newsletter",
    });

    if (!ok) {
      setApiError("Could not subscribe. Please try again.");
      setStatus("idle");
      return;
    }

    setStatus("success");
  }

  if (status === "success") {
    return (
      <p className="font-sans text-sm font-semibold text-brand-gold">
        ✓ You&rsquo;re subscribed, thanks!
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1 flex flex-col gap-1">
          <label htmlFor="nl-email" className="sr-only">
            Email address
          </label>
          <input
            id="nl-email"
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError(null);
            }}
            autoComplete="email"
            className={[
              "w-full rounded-lg border bg-white px-4 py-2.5 font-sans text-sm text-slate-800 placeholder:text-slate-400",
              "transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1",
              error
                ? "border-red-400 focus:ring-red-400"
                : "border-slate-300 focus:border-brand-navy focus:ring-brand-navy/30",
            ]
              .filter(Boolean)
              .join(" ")}
            aria-describedby={error ? "nl-error" : undefined}
            aria-invalid={error ? true : undefined}
          />
        </div>
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={status === "loading"}
          className="sm:self-start shrink-0"
        >
          {status === "loading" ? "…" : "Subscribe"}
        </Button>
      </div>

      {/* Inline validation error */}
      {error && (
        <p id="nl-error" className="mt-1.5 font-sans text-xs text-red-500" role="alert">
          {error}
        </p>
      )}

      {/* API error */}
      {apiError && (
        <p className="mt-1.5 font-sans text-xs text-red-500" role="alert">
          {apiError}
        </p>
      )}
    </form>
  );
}
