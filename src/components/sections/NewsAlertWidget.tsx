"use client";

import { useState } from "react";
import Link from "next/link";
import { Megaphone, X } from "lucide-react";
import type { NewsAlertItem } from "@/lib/cms";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", { month: "short", day: "numeric", year: "numeric" }).format(
    new Date(date)
  );
}

export default function NewsAlertWidget({ items }: { items: NewsAlertItem[] }) {
  const [open, setOpen] = useState(false);

  if (!items.length) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open news and alerts"
        className="hidden sm:flex fixed bottom-6 right-6 z-40 flex-col items-center justify-center gap-3  text-white  duration-200 cursor-pointer bg-white  "
        style={{padding:"20px 10px",borderRadius:"20px 0px 20px 0px"}}
      >
        <span className="relative flex items-center justify-center w-14 h-14 rounded-full bg-brand-gold text-white animate-attention-glow">
          <Megaphone className="w-7 h-7 text-white" aria-hidden="true" />
          <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-white text-brand-navy text-[11px] font-bold animate-pulse">
            {items.length}
          </span>
        </span>
        <span className="font-heading text-sm font-bold text-black bg-gold ">News &amp; Alerts</span>
        {/* <span className="font-sans text-xs text-white/60">Latest updates</span> */}
      </button>

      {open && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-brand-navy/70 px-4">
          <div className="w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <p className="font-sans text-xs font-semibold uppercase tracking-widest text-brand-gold mb-1">
                  News &amp; Alerts
                </p>
                <h2 className="font-heading text-xl font-bold text-brand-navy">Latest Updates</h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <ul className="space-y-3">
              {items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl border border-slate-200 p-4 hover:border-brand-gold hover:bg-brand-cream/60 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="rounded-full bg-brand-navy/8 text-brand-navy text-[11px] font-bold uppercase tracking-wide px-2.5 py-0.5">
                        {item.type === "blog" ? "Article" : "Case Study"}
                      </span>
                      <span className="font-sans text-xs text-slate-400">{formatDate(item.date)}</span>
                    </div>
                    <p className="font-heading text-sm font-bold text-brand-navy mb-1">{item.title}</p>
                    {item.excerpt && (
                      <p className="font-sans text-xs text-slate-500 leading-relaxed line-clamp-2">
                        {item.excerpt}
                      </p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
