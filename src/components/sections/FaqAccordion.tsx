"use client";

import { useState } from "react";

type FaqItem = { q: string; a: string };
type FaqCategory = { category: string; items: FaqItem[] };

export default function FaqAccordion({ categories }: { categories: FaqCategory[] }) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="space-y-12">
      {categories.map((cat) => (
        <div key={cat.category}>
          <h2 className="font-serif text-xl font-bold text-brand-navy mb-4 pb-3 border-b border-slate-200">
            {cat.category}
          </h2>
          <div className="space-y-3">
            {cat.items.map((item) => {
              const id = `${cat.category}::${item.q}`;
              const isOpen = open === id;
              return (
                <div
                  key={item.q}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : id)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-inset"
                  >
                    <span className="font-serif text-sm sm:text-base font-semibold text-brand-navy">
                      {item.q}
                    </span>
                    <svg
                      className={`w-5 h-5 text-brand-gold shrink-0 transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 border-t border-slate-100">
                      <p className="font-sans text-sm text-slate-600 leading-relaxed pt-4">
                        {item.a}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
