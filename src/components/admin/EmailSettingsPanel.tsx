"use client";

import { useState } from "react";
import { DeliveryNotice, MailPanel, MailPanelHeader } from "@/components/ui/email-command-center";
import type { SmtpStatus } from "@/lib/email";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-0.5 truncate text-sm font-medium text-brand-navy">{value}</p>
    </div>
  );
}

export default function EmailSettingsPanel({
  status,
  subscribedCount,
  unsubscribedCount,
}: {
  status: SmtpStatus;
  subscribedCount: number;
  unsubscribedCount: number;
}) {
  const [isSending, setIsSending] = useState(false);
  const [notice, setNotice] = useState<{ tone: "success" | "error"; text: string } | null>(null);

  async function handleTestSend() {
    setIsSending(true);
    setNotice(null);

    try {
      const response = await fetch("/api/admin/emails/test", { method: "POST" });
      const data = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null;

      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || "Test email failed.");
      }

      setNotice({ tone: "success", text: "Test email sent — check your inbox." });
    } catch (error) {
      setNotice({ tone: "error", text: error instanceof Error ? error.message : "Test email failed." });
    } finally {
      setIsSending(false);
    }
  }

  return (
    <MailPanel>
      <MailPanelHeader
        title="Delivery settings"
        description="SMTP is configured via environment variables on the server. This panel is read-only and lets you confirm delivery is working."
      />

      <div className="px-5 py-4">
        {status.configured ? (
          <>
            <div className="mb-4 flex items-center gap-2">
              <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
              <span className="text-sm font-semibold text-emerald-700">SMTP configured</span>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <Field label="Host" value={status.host} />
              <Field label="Port" value={`${status.port}${status.secure ? " (TLS)" : ""}`} />
              <Field label="User" value={status.user} />
              <Field label="From" value={status.from} />
              <Field label="Reply-to" value={status.replyTo} />
              <Field label="Password" value="••••••••" />
            </div>
          </>
        ) : (
          <div className="mb-4 flex items-center gap-2">
            <span className="h-2 w-2 shrink-0 rounded-full bg-red-500" />
            <span className="text-sm font-semibold text-red-700">
              SMTP is not configured — set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, and SMTP_FROM in the
              server environment.
            </span>
          </div>
        )}

        <p className="mt-4 text-sm text-slate-500">
          <span className="font-semibold text-brand-navy">{subscribedCount}</span> active newsletter subscriber
          {subscribedCount === 1 ? "" : "s"}
          {unsubscribedCount > 0 ? (
            <>
              {" "}
              · <span className="font-semibold text-slate-600">{unsubscribedCount}</span> unsubscribed
            </>
          ) : null}
        </p>

        <div className="mt-4 flex items-center gap-4">
          <button
            type="button"
            onClick={handleTestSend}
            disabled={!status.configured || isSending}
            className="inline-flex items-center gap-2 rounded-full border border-brand-navy px-5 py-2 text-sm font-semibold text-brand-navy transition hover:bg-brand-navy hover:text-white disabled:cursor-not-allowed disabled:border-slate-300 disabled:text-slate-400 disabled:hover:bg-transparent"
          >
            {isSending ? "Sending…" : "Send test email"}
          </button>
        </div>

        {notice ? (
          <div className="mt-4">
            <DeliveryNotice tone={notice.tone} text={notice.text} />
          </div>
        ) : null}
      </div>
    </MailPanel>
  );
}
