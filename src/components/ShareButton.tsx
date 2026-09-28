"use client";

import { useState } from "react";

type Props = { url: string; title: string; className?: string };

/**
 * Single compact share icon for list cards. Uses the native share sheet where
 * available (mobile browsers); falls back to copying the link on desktop,
 * where navigator.share is usually unsupported.
 */
export default function ShareButton({ url, title, className = "" }: Props) {
  const [copied, setCopied] = useState(false);

  const onClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // User dismissed the native share sheet — no fallback needed.
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — nothing sensible to fall back to.
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Share "${title}"`}
      className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 border border-slate-200 hover:text-brand-gold hover:border-brand-gold/50 hover:bg-brand-gold/5 transition-colors duration-200 shrink-0 ${className}`}
    >
      {copied ? (
        <svg className="w-3.5 h-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342a3 3 0 100-2.684m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.368-2.684 3 3 0 00-5.368 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      )}
    </button>
  );
}
