"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { SiteAlert as SiteAlertType } from "@/types";

export default function SiteAlert({
  banner,
  popup,
}: {
  banner: SiteAlertType | null;
  popup: SiteAlertType | null;
}) {
  const [showBanner, setShowBanner] = useState(Boolean(banner));
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (!popup) return;
    const dismissed = window.sessionStorage.getItem(`site-alert-${popup.id}`);
    if (dismissed) return;
    const timer = window.setTimeout(() => setShowPopup(true), 0);
    return () => window.clearTimeout(timer);
  }, [popup]);

  function dismissPopup() {
    if (popup) window.sessionStorage.setItem(`site-alert-${popup.id}`, "dismissed");
    setShowPopup(false);
  }

  return (
    <>
      {banner && showBanner && (
        <div className="bg-brand-gold text-brand-navy">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="font-sans text-sm font-bold">{banner.title}</p>
              <p className="font-sans text-xs text-brand-navy/75">{banner.message}</p>
            </div>
            <div className="flex items-center gap-3">
              {banner.cta_href && banner.cta_label && (
                <Link
                  href={banner.cta_href}
                  className="font-sans text-xs font-bold underline underline-offset-4"
                >
                  {banner.cta_label}
                </Link>
              )}
              <button
                type="button"
                onClick={() => setShowBanner(false)}
                className="font-sans text-xs font-bold text-brand-navy/70 hover:text-brand-navy"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {popup && showPopup && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-brand-navy/70 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4 mb-3">
              <h2 className="font-heading text-2xl font-bold text-brand-navy">{popup.title}</h2>
              <button
                type="button"
                onClick={dismissPopup}
                className="rounded-md px-2 py-1 font-sans text-sm text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close popup"
              >
                ×
              </button>
            </div>
            <p className="font-sans text-sm leading-relaxed text-slate-600 mb-5">
              {popup.message}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              {popup.cta_href && popup.cta_label && (
                <Link
                  href={popup.cta_href}
                  onClick={dismissPopup}
                  className="inline-flex justify-center rounded-lg bg-brand-gold px-5 py-2.5 font-sans text-sm font-bold text-brand-navy hover:bg-amber-400"
                >
                  {popup.cta_label}
                </Link>
              )}
              <button
                type="button"
                onClick={dismissPopup}
                className="inline-flex justify-center rounded-lg border border-slate-200 px-5 py-2.5 font-sans text-sm font-bold text-slate-600 hover:bg-slate-50"
              >
                Not now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
