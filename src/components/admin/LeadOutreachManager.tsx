"use client";

import { useMemo, useState } from "react";
import { buildEmailTemplate, EMAIL_TEMPLATE_LABELS, type EmailTemplateKey } from "@/lib/email-templates";
import { LEAD_SOURCE_LABELS, LEAD_SOURCES, LEAD_STATUS_COLORS } from "@/lib/lead-meta";
import type { Lead as LeadType, LeadSource } from "@/types";

type LeadRow = Pick<
  LeadType,
  | "id"
  | "serial_number"
  | "name"
  | "email"
  | "phone"
  | "company_name"
  | "source"
  | "message"
  | "status"
  | "created_at"
  | "service_interest"
>;

type RecipientMode = "filtered" | "selected";
type ViewMode = "all" | "selected";

function dedupeEmails(leads: LeadRow[]) {
  const seen = new Set<string>();
  const emails: string[] = [];

  for (const lead of leads) {
    const email = lead.email.trim().toLowerCase();
    if (!email || seen.has(email)) continue;
    seen.add(email);
    emails.push(email);
  }

  return emails;
}

export default function LeadOutreachManager({
  leads,
  activeSource,
  totalCount,
  countBySource,
}: {
  leads: LeadRow[];
  activeSource: LeadSource | null;
  totalCount: number;
  countBySource: Partial<Record<LeadSource, number>>;
}) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const [recipientMode, setRecipientMode] = useState<RecipientMode>("filtered");
  const [templateKey, setTemplateKey] = useState<EmailTemplateKey>("new-article");
  const [subject, setSubject] = useState(buildEmailTemplate("new-article").subject);
  const [body, setBody] = useState(buildEmailTemplate("new-article").body);
  const [copyStatus, setCopyStatus] = useState("");
  const [sendStatus, setSendStatus] = useState("");
  const [sendError, setSendError] = useState("");
  const [isSending, setIsSending] = useState(false);

  const selectedIdSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const visibleLeads = useMemo(() => {
    if (viewMode === "selected") {
      return leads.filter((lead) => selectedIdSet.has(lead.id));
    }

    return leads;
  }, [leads, selectedIdSet, viewMode]);

  const selectedLeads = useMemo(
    () => leads.filter((lead) => selectedIdSet.has(lead.id)),
    [leads, selectedIdSet]
  );

  const recipientLeads = recipientMode === "selected" ? selectedLeads : leads;
  const recipientEmails = useMemo(() => dedupeEmails(recipientLeads), [recipientLeads]);
  const filteredRecipientCount = useMemo(() => dedupeEmails(leads).length, [leads]);
  const selectedRecipientCount = useMemo(() => dedupeEmails(selectedLeads).length, [selectedLeads]);

  const allVisibleSelected =
    visibleLeads.length > 0 && visibleLeads.every((lead) => selectedIdSet.has(lead.id));

  const activeSourceLabel = activeSource ? LEAD_SOURCE_LABELS[activeSource] : "All Leads";

  function setTemplate(nextTemplate: EmailTemplateKey) {
    const next = buildEmailTemplate(nextTemplate);
    setTemplateKey(nextTemplate);
    setSubject(next.subject);
    setBody(next.body);
  }

  function toggleLead(id: string) {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  }

  function toggleVisibleLeads() {
    if (allVisibleSelected) {
      const visibleIds = new Set(visibleLeads.map((lead) => lead.id));
      setSelectedIds((current) => current.filter((id) => !visibleIds.has(id)));
      return;
    }

    const next = new Set(selectedIds);
    for (const lead of visibleLeads) {
      next.add(lead.id);
    }
    setSelectedIds(Array.from(next));
  }

  function clearSelection() {
    setSelectedIds([]);
    setViewMode("all");
    setSendStatus("");
    setSendError("");
    if (recipientMode === "selected") {
      setRecipientMode("filtered");
    }
  }

  async function copyText(text: string, successMessage: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus(successMessage);
      window.setTimeout(() => setCopyStatus(""), 2500);
    } catch {
      setCopyStatus("Clipboard access failed. Copy it manually.");
      window.setTimeout(() => setCopyStatus(""), 2500);
    }
  }

  function openMailDraft() {
    if (recipientEmails.length === 0) return;

    const params = new URLSearchParams();
    params.set("bcc", recipientEmails.join(","));
    if (subject.trim()) params.set("subject", subject.trim());
    if (body.trim()) params.set("body", body);
    window.location.href = `mailto:?${params.toString()}`;
  }

  async function sendEmail() {
    if (recipientEmails.length === 0) {
      setSendError("Choose at least one recipient.");
      setSendStatus("");
      return;
    }

    if (!subject.trim()) {
      setSendError("Subject is required.");
      setSendStatus("");
      return;
    }

    if (!body.trim()) {
      setSendError("Message is required.");
      setSendStatus("");
      return;
    }

    const confirmed = window.confirm(
      `Send this email to ${recipientEmails.length} recipient${recipientEmails.length === 1 ? "" : "s"}?`
    );

    if (!confirmed) return;

    setIsSending(true);
    setSendError("");
    setSendStatus("");

    try {
      const response = await fetch("/api/admin/emails/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audienceKind: "manual",
          audienceLabel:
            recipientMode === "selected"
              ? activeSource
                ? `${LEAD_SOURCE_LABELS[activeSource]} selected leads`
                : "Selected leads"
              : activeSource
                ? `${LEAD_SOURCE_LABELS[activeSource]} leads`
                : "All visible leads",
          sourceFilter: activeSource,
          recipients: recipientEmails,
          subject,
          body,
        }),
      });

      const data = (await response.json().catch(() => null)) as
        | { ok?: boolean; sentCount?: number; failedCount?: number; error?: string }
        | null;

      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || "Email sending failed.");
      }

      setSendStatus(
        `Processed ${recipientEmails.length} recipient${recipientEmails.length === 1 ? "" : "s"}: ${data.sentCount ?? 0} sent, ${data.failedCount ?? 0} failed. Check Email Center for full delivery history.`
      );
    } catch (error) {
      setSendError(error instanceof Error ? error.message : "Email sending failed.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap gap-2">
        <a
          href="/admin/leads"
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
            !activeSource
              ? "bg-brand-navy text-white border-brand-navy"
              : "bg-white text-slate-600 border-slate-200 hover:border-brand-navy/40"
          }`}
        >
          {`All (${totalCount})`}
        </a>
        {LEAD_SOURCES.map((source) => (
          <a
            key={source}
            href={`/admin/leads?source=${source}`}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              activeSource === source
                ? "bg-brand-navy text-white border-brand-navy"
                : "bg-white text-slate-600 border-slate-200 hover:border-brand-navy/40"
            }`}
          >
            {`${LEAD_SOURCE_LABELS[source]} (${countBySource[source] ?? 0})`}
          </a>
        ))}
      </div>

      <div className="mb-6 grid gap-3 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)]">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="font-heading text-lg font-bold text-brand-navy">Lead Outreach</h2>
              <p className="mt-1 text-sm text-slate-500">
                Send an update to all leads in the current filter or only to the people you select.
              </p>
            </div>
            <div className="grid gap-2 text-xs text-slate-500 sm:grid-cols-3">
              <div className="rounded-lg bg-slate-50 px-3 py-2">
                <span className="block uppercase tracking-wide text-slate-400">Current filter</span>
                <strong className="mt-1 block text-sm text-brand-navy">{activeSourceLabel}</strong>
              </div>
              <div className="rounded-lg bg-slate-50 px-3 py-2">
                <span className="block uppercase tracking-wide text-slate-400">Selected leads</span>
                <strong className="mt-1 block text-sm text-brand-navy">{selectedLeads.length}</strong>
              </div>
              <div className="rounded-lg bg-slate-50 px-3 py-2">
                <span className="block uppercase tracking-wide text-slate-400">Recipients</span>
                <strong className="mt-1 block text-sm text-brand-navy">{recipientEmails.length}</strong>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div className="grid gap-4">
              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Send to
                </span>
                <select
                  value={recipientMode}
                  onChange={(event) => setRecipientMode(event.target.value as RecipientMode)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/30"
                >
                  <option value="filtered">
                    {`All ${activeSource ? activeSourceLabel : "visible leads"} (${filteredRecipientCount})`}
                  </option>
                  <option value="selected">{`Selected leads only (${selectedRecipientCount})`}</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Template
                </span>
                <select
                  value={templateKey}
                  onChange={(event) => setTemplate(event.target.value as EmailTemplateKey)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/30"
                >
                  {Object.entries(EMAIL_TEMPLATE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>

              <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-3 text-xs leading-5 text-slate-500">
                Use the source tabs above for filters like newsletter-only. Each server-side send is now
                logged per recipient in Email Center so you can review sent and failed addresses.
              </div>
              <a
                href={activeSource ? `/admin/emails?source=${activeSource}` : "/admin/emails"}
                className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-brand-navy transition hover:bg-slate-50"
              >
                Open Email Center
              </a>
            </div>

            <div className="grid gap-4">
              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Subject
                </span>
                <input
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  placeholder="Email subject"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/30"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Message
                </span>
                <textarea
                  value={body}
                  onChange={(event) => setBody(event.target.value)}
                  rows={11}
                  placeholder="Write your message here"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/30"
                />
              </label>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={sendEmail}
                  disabled={recipientEmails.length === 0 || isSending}
                  className="rounded-lg bg-brand-gold px-4 py-2 text-sm font-semibold text-brand-navy transition hover:bg-brand-gold/90 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-white"
                >
                  {isSending ? "Sending..." : "Send Email"}
                </button>
                <button
                  type="button"
                  onClick={openMailDraft}
                  disabled={recipientEmails.length === 0}
                  className="rounded-lg bg-brand-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-navy/90 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  Open Email Draft
                </button>
                <button
                  type="button"
                  onClick={() => copyText(recipientEmails.join(","), "Recipient emails copied.")}
                  disabled={recipientEmails.length === 0}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-brand-navy transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
                >
                  Copy Recipients
                </button>
                <button
                  type="button"
                  onClick={() =>
                    copyText(`Subject: ${subject}\n\n${body}`, "Email template copied.")
                  }
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-brand-navy transition hover:bg-slate-50"
                >
                  Copy Template
                </button>
                {copyStatus && <span className="text-xs text-emerald-600">{copyStatus}</span>}
              </div>
              {sendStatus && <p className="text-sm text-emerald-600">{sendStatus}</p>}
              {sendError && <p className="text-sm text-red-600">{sendError}</p>}
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-heading text-lg font-bold text-brand-navy">Quick Counts</h2>
          <div className="mt-4 grid gap-3">
            <div className="rounded-lg bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">All leads</p>
              <p className="mt-1 text-2xl font-bold text-brand-navy">{totalCount}</p>
            </div>
            <div className="rounded-lg bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Newsletter</p>
              <p className="mt-1 text-2xl font-bold text-brand-navy">{countBySource.newsletter ?? 0}</p>
            </div>
            <div className="rounded-lg bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Current view</p>
              <p className="mt-1 text-2xl font-bold text-brand-navy">{visibleLeads.length}</p>
            </div>
          </div>
        </section>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={toggleVisibleLeads}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-brand-navy transition hover:bg-slate-50"
        >
          {allVisibleSelected ? "Unselect visible leads" : "Select visible leads"}
        </button>
        <button
          type="button"
          onClick={clearSelection}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          Clear selection
        </button>
        <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1">
          <button
            type="button"
            onClick={() => setViewMode("all")}
            className={`rounded-md px-3 py-1.5 text-sm font-semibold transition ${
              viewMode === "all" ? "bg-brand-navy text-white" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            All visible
          </button>
          <button
            type="button"
            onClick={() => setViewMode("selected")}
            className={`rounded-md px-3 py-1.5 text-sm font-semibold transition ${
              viewMode === "selected"
                ? "bg-brand-navy text-white"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            {`Selected only (${selectedLeads.length})`}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-sans">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3">
                  <span className="sr-only">Select lead</span>
                </th>
                <th className="text-left px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Lead No</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Date</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Email</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Phone</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Company</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Source</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibleLeads.length > 0 ? (
                visibleLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 align-top">
                      <input
                        type="checkbox"
                        checked={selectedIdSet.has(lead.id)}
                        onChange={() => toggleLead(lead.id)}
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-gold"
                        aria-label={`Select ${lead.name}`}
                      />
                    </td>
                    <td className="px-4 py-3 font-semibold text-brand-navy whitespace-nowrap text-xs">
                      {lead.serial_number ?? <span className="text-slate-300">N/A</span>}
                    </td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap text-xs">
                      {new Date(lead.created_at).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3 font-semibold text-brand-navy whitespace-nowrap">{lead.name}</td>
                    <td className="px-4 py-3 text-slate-600">
                      <a href={`mailto:${lead.email}`} className="hover:text-brand-gold transition-colors">
                        {lead.email}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                      {lead.phone ?? <span className="text-slate-300">N/A</span>}
                    </td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                      {lead.company_name ?? <span className="text-slate-300">N/A</span>}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-brand-navy/8 text-brand-navy">
                        {LEAD_SOURCE_LABELS[lead.source] ?? lead.source}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium border ${
                          LEAD_STATUS_COLORS[lead.status] ??
                          "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 max-w-xs">
                      <p className="truncate text-xs" title={lead.message ?? ""}>
                        {lead.message ?? <span className="text-slate-300">N/A</span>}
                      </p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center text-slate-400 text-sm">
                    {viewMode === "selected"
                      ? "No selected leads in this view."
                      : activeSource
                        ? `No ${LEAD_SOURCE_LABELS[activeSource]} leads yet.`
                        : "No leads yet."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
