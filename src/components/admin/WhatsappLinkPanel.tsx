"use client";

import { useEffect, useState, useTransition } from "react";
import { unlinkWhatsappAction } from "@/app/admin/(protected)/cms/actions";
import { cardClass } from "@/components/admin/cms/FormControls";
import type { LinkedWhatsappStatus } from "@/lib/whatsapp-link";

export default function WhatsappLinkPanel({ initial }: { initial: LinkedWhatsappStatus }) {
  const [link, setLink] = useState(initial);
  const [isUnlinking, startUnlink] = useTransition();

  // Poll fast while waiting for a scan (QR codes rotate every ~20s), slowly once linked.
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(
      async () => {
        try {
          const response = await fetch("/api/admin/whatsapp/status", { cache: "no-store" });
          if (response.ok && !cancelled) setLink(await response.json());
        } catch {
          // keep the last known state; next tick retries
        }
      },
      link.status === "connected" ? 15000 : 3000
    );
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [link]);

  function unlink() {
    if (!confirm("Unlink this WhatsApp? Messages will stop until you scan the QR code again.")) return;
    startUnlink(async () => {
      await unlinkWhatsappAction();
      setLink({ status: "starting", qr: null, me: null });
    });
  }

  return (
    <div className={`${cardClass} mb-6 max-w-xl`}>
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Linked WhatsApp (free)</p>

      {link.status === "connected" ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium text-emerald-700">
            ✓ Linked as {link.me ?? "your WhatsApp"}. Lead alerts and messages are sent from this number.
          </p>
          <button
            type="button"
            onClick={unlink}
            disabled={isUnlinking}
            className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            {isUnlinking ? "Unlinking…" : "Unlink"}
          </button>
        </div>
      ) : link.status === "qr" && link.qr ? (
        <div className="flex flex-wrap items-start gap-5">
          {/* eslint-disable-next-line @next/next/no-img-element -- data: URL QR code */}
          <img src={link.qr} alt="WhatsApp link QR code" width={220} height={220} className="rounded-lg border border-slate-200" />
          <ol className="list-decimal space-y-1 pl-4 text-sm text-slate-600">
            <li>Open WhatsApp on your phone.</li>
            <li>Tap ⋮ / Settings → <strong>Linked devices</strong> → <strong>Link a device</strong>.</li>
            <li>Scan this code. It refreshes automatically.</li>
          </ol>
        </div>
      ) : link.status === "offline" ? (
        <p className="text-sm font-medium text-amber-700">
          The WhatsApp service isn&apos;t running on the server (pm2 process <code>beipoready-whatsapp</code>).
        </p>
      ) : (
        <p className="text-sm text-slate-500">Connecting to WhatsApp… the QR code will appear here in a few seconds.</p>
      )}

      <p className="mt-4 text-xs text-slate-400">
        Unofficial: WhatsApp can ban numbers that send automated or bulk messages. Use a spare number if you can, and
        avoid messaging people who haven&apos;t saved your number.
      </p>
    </div>
  );
}
