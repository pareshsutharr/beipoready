"use client";

import { useActionState, useEffect, useMemo, useState, type ReactNode } from "react";
import { Code2, FileText, ImageIcon, Mail, RotateCcw, Send, Sparkles, Type } from "lucide-react";
import Modal from "@/components/admin/Modal";
import { saveEmailTemplate, resetEmailTemplate, type TemplateActionState } from "@/app/admin/(protected)/emails/templates/actions";
import type { CustomizableTemplateKey, EmailTemplateFormat } from "@/lib/email-templates";
import type { EffectiveEmailTemplate } from "@/lib/email-template-store";
import { renderBrandedEmailHtml, stripHtmlToText, textToContentHtml } from "@/lib/email-layout";
import { SITE_URL } from "@/lib/seo";

const TEMPLATE_ICONS: Record<CustomizableTemplateKey, ReactNode> = {
  "new-article": <FileText className="h-5 w-5" />,
  newsletter: <Mail className="h-5 w-5" />,
  "follow-up": <Send className="h-5 w-5" />,
  welcome: <Sparkles className="h-5 w-5" />,
};

const INITIAL_ACTION_STATE: TemplateActionState = { ok: false, error: null };
const PLACEHOLDER_FOOTER =
  'You\'re receiving this because you subscribed to Be IPO Ready updates. <a href="#" style="color:#64748B;">Unsubscribe</a>';

function snippet(text: string) {
  const normalized = text.replace(/\s+/g, " ").trim();
  return normalized.length <= 110 ? normalized : `${normalized.slice(0, 107)}...`;
}

function cardSnippet(template: EffectiveEmailTemplate) {
  return snippet(template.format === "html" ? stripHtmlToText(template.htmlBody) : template.body);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

/** Renders exactly what email.ts sends: the message wrapped in the shared branded shell, in an isolated iframe. */
function EmailPreviewFrame({ subject, format, body }: { subject: string; format: EmailTemplateFormat; body: string }) {
  const srcDoc = useMemo(() => {
    const contentHtml = format === "html" ? body : textToContentHtml(body || " ");
    return renderBrandedEmailHtml({
      preheader: subject,
      contentHtml: contentHtml || "<p>&nbsp;</p>",
      footerHtml: PLACEHOLDER_FOOTER,
      logoUrl: `${SITE_URL}/logo-transparent.png`,
      siteUrl: SITE_URL,
    });
  }, [subject, format, body]);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <div className="space-y-1 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
        <p>
          <span className="font-semibold text-slate-400">From:</span> Be IPO Ready
        </p>
        <p>
          <span className="font-semibold text-slate-400">Subject:</span>{" "}
          <span className="font-semibold text-brand-navy">{subject || "(no subject)"}</span>
        </p>
      </div>
      <iframe
        srcDoc={srcDoc}
        title="Email preview"
        sandbox=""
        className="h-[480px] w-full bg-[#F7F3EA]"
      />
    </div>
  );
}

function FormatBadge({ format }: { format: EmailTemplateFormat }) {
  return format === "html" ? (
    <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
      <Code2 className="h-3 w-3" />
      HTML code
    </span>
  ) : null;
}

function TemplateCard({ template, onOpen }: { template: EffectiveEmailTemplate; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex flex-col items-start gap-3 rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-brand-navy/30 hover:shadow-md"
    >
      <div className="flex w-full items-start justify-between gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-navy/8 text-brand-navy">
          {TEMPLATE_ICONS[template.key]}
        </span>
        <div className="flex shrink-0 flex-wrap justify-end gap-1.5">
          <FormatBadge format={template.format} />
          {template.isCustomized ? (
            <span className="rounded-full border border-brand-gold/30 bg-brand-gold/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-brand-gold-ink">
              Customized
            </span>
          ) : null}
        </div>
      </div>
      <div className="min-w-0">
        <h3 className="font-heading text-base font-bold text-brand-navy">{template.label}</h3>
        <p className="mt-1 truncate text-sm font-medium text-slate-600">{template.subject || "(no subject)"}</p>
        <p className="mt-1.5 text-sm leading-5 text-slate-400">{cardSnippet(template)}</p>
      </div>
      <span className="mt-auto pt-1 text-sm font-semibold text-brand-navy underline-offset-2 group-hover:underline">
        Preview &amp; customize →
      </span>
    </button>
  );
}

function EditForm({
  template,
  onSaved,
  onCancel,
}: {
  template: EffectiveEmailTemplate;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [mode, setMode] = useState<EmailTemplateFormat>(template.format);
  const [subject, setSubject] = useState(template.subject);
  const [textBody, setTextBody] = useState(template.body);
  const [htmlBody, setHtmlBody] = useState(template.htmlBody);
  const [saveState, saveFormAction, isSaving] = useActionState(saveEmailTemplate, INITIAL_ACTION_STATE);

  useEffect(() => {
    if (saveState.ok) onSaved();
  }, [saveState.ok, onSaved]);

  return (
    <form action={saveFormAction} className="grid gap-4">
      <input type="hidden" name="key" value={template.key} />
      <input type="hidden" name="mode" value={mode} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="block flex-1">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Subject</span>
          <input
            name="subject"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/30"
          />
        </label>
      </div>

      <div className="inline-flex w-fit rounded-lg border border-slate-200 bg-slate-50 p-1">
        <button
          type="button"
          onClick={() => setMode("text")}
          className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-semibold transition ${
            mode === "text" ? "bg-brand-navy text-white" : "text-slate-600 hover:bg-white"
          }`}
        >
          <Type className="h-3.5 w-3.5" />
          Simple text
        </button>
        <button
          type="button"
          onClick={() => setMode("html")}
          className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-semibold transition ${
            mode === "html" ? "bg-brand-navy text-white" : "text-slate-600 hover:bg-white"
          }`}
        >
          <Code2 className="h-3.5 w-3.5" />
          Customize by code
        </button>
      </div>

      {mode === "text" ? (
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Message</span>
          <textarea
            name="body"
            value={textBody}
            onChange={(event) => setTextBody(event.target.value)}
            rows={12}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-sans focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/30"
          />
        </label>
      ) : (
        <>
          <input type="hidden" name="htmlBody" value={htmlBody} />
          <div className="flex items-start gap-2 rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-2.5 text-xs leading-5 text-slate-500">
            <ImageIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span>
              Write the HTML that goes inside the email — it&apos;s automatically wrapped in the branded header, card, and
              footer. Add images with{" "}
              <code className="rounded bg-white px-1 py-0.5 text-[11px] text-brand-navy">
                {'<img src="https://..." style="max-width:100%;height:auto;" />'}
              </code>{" "}
              and buttons with a styled <code className="rounded bg-white px-1 py-0.5 text-[11px] text-brand-navy">{"<a>"}</code>.
            </span>
          </div>
          <div className="grid gap-3 lg:grid-cols-2">
            <textarea
              value={htmlBody}
              onChange={(event) => setHtmlBody(event.target.value)}
              rows={18}
              spellCheck={false}
              className="w-full resize-y rounded-lg border border-slate-300 bg-slate-900 px-3 py-2.5 font-mono text-[12.5px] leading-5 text-slate-100 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/30"
            />
            <div className="min-h-[280px] overflow-hidden rounded-lg border border-slate-200">
              <iframe
                srcDoc={renderBrandedEmailHtml({
                  preheader: subject,
                  contentHtml: htmlBody || "<p>&nbsp;</p>",
                  footerHtml: PLACEHOLDER_FOOTER,
                  logoUrl: `${SITE_URL}/logo-transparent.png`,
                  siteUrl: SITE_URL,
                })}
                title="Live HTML preview"
                sandbox=""
                className="h-full min-h-[280px] w-full bg-[#F7F3EA]"
              />
            </div>
          </div>
        </>
      )}

      {saveState.error ? <p className="text-sm text-red-600">{saveState.error}</p> : null}

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-lg bg-brand-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-navy/90 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isSaving ? "Saving..." : `Save as ${mode === "html" ? "HTML code" : "simple text"}`}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function ResetButton({ templateKey, onReset }: { templateKey: CustomizableTemplateKey; onReset: () => void }) {
  const [resetState, resetFormAction, isResetting] = useActionState(resetEmailTemplate, INITIAL_ACTION_STATE);

  useEffect(() => {
    if (resetState.ok) onReset();
  }, [resetState.ok, onReset]);

  return (
    <form action={resetFormAction}>
      <input type="hidden" name="key" value={templateKey} />
      <button
        type="submit"
        disabled={isResetting}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
        title="Restores both the simple-text and HTML-code versions to their defaults"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        {isResetting ? "Resetting..." : "Reset to default"}
      </button>
    </form>
  );
}

export default function EmailTemplateGrid({ templates }: { templates: EffectiveEmailTemplate[] }) {
  const [openKey, setOpenKey] = useState<CustomizableTemplateKey | null>(null);
  const [mode, setMode] = useState<"preview" | "edit">("preview");

  const openTemplate = templates.find((template) => template.key === openKey) ?? null;

  function close() {
    setOpenKey(null);
    setMode("preview");
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {templates.map((template) => (
          <TemplateCard
            key={template.key}
            template={template}
            onOpen={() => {
              setOpenKey(template.key);
              setMode("preview");
            }}
          />
        ))}
      </div>

      <Modal
        open={Boolean(openTemplate)}
        onClose={close}
        title={openTemplate?.label ?? ""}
        description={
          openTemplate
            ? `${openTemplate.isCustomized ? "Customized" : "Default"} · sending as ${
                openTemplate.format === "html" ? "HTML code" : "simple text"
              }${openTemplate.isCustomized && openTemplate.updatedAt ? ` · updated ${formatDate(openTemplate.updatedAt)}` : ""}`
            : undefined
        }
      >
        {openTemplate ? (
          <div className="grid gap-4">
            <div className="inline-flex w-fit rounded-lg border border-slate-200 bg-slate-50 p-1">
              <button
                type="button"
                onClick={() => setMode("preview")}
                className={`rounded-md px-3 py-1.5 text-sm font-semibold transition ${
                  mode === "preview" ? "bg-brand-navy text-white" : "text-slate-600 hover:bg-white"
                }`}
              >
                Preview
              </button>
              <button
                type="button"
                onClick={() => setMode("edit")}
                className={`rounded-md px-3 py-1.5 text-sm font-semibold transition ${
                  mode === "edit" ? "bg-brand-navy text-white" : "text-slate-600 hover:bg-white"
                }`}
              >
                Customize
              </button>
            </div>

            {mode === "preview" ? (
              <>
                <EmailPreviewFrame
                  subject={openTemplate.subject}
                  format={openTemplate.format}
                  body={openTemplate.format === "html" ? openTemplate.htmlBody : openTemplate.body}
                />
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setMode("edit")}
                    className="rounded-lg bg-brand-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-navy/90"
                  >
                    Customize this template
                  </button>
                  {openTemplate.isCustomized ? (
                    <ResetButton templateKey={openTemplate.key} onReset={close} />
                  ) : null}
                </div>
              </>
            ) : (
              <EditForm template={openTemplate} onSaved={close} onCancel={() => setMode("preview")} />
            )}
          </div>
        ) : null}
      </Modal>
    </>
  );
}
