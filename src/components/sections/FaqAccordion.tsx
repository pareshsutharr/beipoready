"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type FaqItem = { q: string; a: string };
type FaqCategory = { category: string; items: FaqItem[] };

export default function FaqAccordion({ categories }: { categories: FaqCategory[] }) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="space-y-12">
      {categories.map((cat) => (
        <div key={cat.category}>
          {cat.category && (
            <h2 className="font-heading text-xl font-bold text-brand-navy mb-4 pb-3 border-b border-slate-200">
              {cat.category}
            </h2>
          )}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white divide-y divide-slate-200">
            {cat.items.map((item, index) => {
              const id = `${cat.category}::${item.q}`;
              const isOpen = open === id;
              const number = String(index + 1).padStart(2, "0");
              return (
                <div key={item.q}>
                  <button
                    onClick={() => setOpen(isOpen ? null : id)}
                    aria-expanded={isOpen}
                    className={`w-full flex items-center gap-4 px-6 py-5 text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-inset ${
                      isOpen ? "bg-brand-cream" : "hover:bg-slate-50"
                    }`}
                  >
                    <span
                      className="font-heading text-sm font-bold text-brand-gold tabular-nums shrink-0"
                      aria-hidden="true"
                    >
                      {number}
                    </span>
                    <span className="flex-1 font-heading text-sm sm:text-base font-semibold text-brand-navy">
                      {item.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-brand-navy shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 py-5 border-t border-slate-200">
                      <p className="font-sans text-sm sm:text-base text-slate-600 leading-relaxed">
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
