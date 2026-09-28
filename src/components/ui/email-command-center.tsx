"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AlertCircle, CheckCircle2, ChevronDown, Send, Users, UserRoundPlus } from "lucide-react";
import { cn } from "@/lib/utils";

export function MailPanel({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cn("rounded-xl border border-slate-200 bg-white", className)}>{children}</section>;
}

export function MailPanelHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="border-b border-slate-100 px-5 py-4">
      <h3 className="font-heading text-base font-semibold text-brand-navy">{title}</h3>
      {description ? <p className="mt-1 text-sm leading-5 text-slate-500">{description}</p> : null}
    </div>
  );
}

export function SidebarGroupLabel({ children }: { children: ReactNode }) {
  return <p className="px-3 pb-1.5 pt-2 text-xs font-semibold uppercase tracking-wider text-slate-400">{children}</p>;
}

export function SidebarNavItem({
  active,
  icon,
  label,
  count,
  onClick,
}: {
  active: boolean;
  icon?: ReactNode;
  label: string;
  count?: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-full px-3 py-2 text-left text-sm transition-colors",
        active ? "bg-brand-gold/15 font-semibold text-brand-navy" : "text-slate-600 hover:bg-slate-100"
      )}
    >
      {icon ? <span className={cn("shrink-0", active ? "text-brand-navy" : "text-slate-400")}>{icon}</span> : null}
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {count !== undefined ? (
        <span className={cn("shrink-0 text-xs", active ? "text-brand-navy" : "text-slate-400")}>{count}</span>
      ) : null}
    </button>
  );
}

export function TemplateChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
        active
          ? "border-brand-navy bg-brand-navy text-white"
          : "border-slate-200 bg-white text-slate-500 hover:border-brand-navy/30 hover:text-brand-navy"
      )}
    >
      {label}
    </button>
  );
}

export function DeliveryNotice({ tone, text }: { tone: "success" | "error"; text: string }) {
  const isSuccess = tone === "success";

  return (
    <div
      className={cn(
        "rounded-lg border px-4 py-3 text-sm font-medium",
        isSuccess ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"
      )}
    >
      <div className="flex items-start gap-2">
        {isSuccess ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />}
        <span>{text}</span>
      </div>
    </div>
  );
}

export function StatusDot({ status }: { status: "sent" | "partial" | "failed" }) {
  const color = status === "sent" ? "bg-emerald-500" : status === "partial" ? "bg-amber-500" : "bg-red-500";
  return <span className={cn("h-2 w-2 shrink-0 rounded-full", color)} />;
}

export function MailListRow({
  subject,
  snippet,
  meta,
  status,
  open,
  onToggle,
  children,
}: {
  subject: string;
  snippet: string;
  meta: string;
  status: "sent" | "partial" | "failed";
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors hover:bg-slate-50"
      >
        <StatusDot status={status} />
        <span className="min-w-0 flex-1 truncate text-sm">
          <span className="font-semibold text-brand-navy">{subject}</span>
          <span className="ml-2 text-slate-400">— {snippet}</span>
        </span>
        <span className="hidden shrink-0 text-xs text-slate-400 sm:inline">{meta}</span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-slate-400 transition-transform", open && "rotate-180")} />
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-slate-100 bg-slate-50 px-5 py-4">{children}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export const mailIcons = {
  send: <Send className="h-4 w-4" />,
  manual: <UserRoundPlus className="h-4 w-4" />,
  leads: <Users className="h-4 w-4" />,
};
