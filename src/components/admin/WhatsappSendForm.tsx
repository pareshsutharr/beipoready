"use client";

import { useActionState, useState } from "react";
import { sendCustomWhatsapp, type WhatsappSendState } from "@/app/admin/(protected)/cms/actions";
import { Checkbox, SubmitRow, cardClass, inputClass, labelClass } from "@/components/admin/cms/FormControls";

const INITIAL_STATE: WhatsappSendState = { ok: false, message: null };

export default function WhatsappSendForm({ phones }: { phones: string[] }) {
  const [message, setMessage] = useState("");
  // Controlled textarea: React resets uncontrolled fields after every action, which would
  // wipe the draft on a failed send. Only clear it once everything went through.
  const [state, formAction] = useActionState(async (prev: WhatsappSendState, formData: FormData) => {
    const result = await sendCustomWhatsapp(prev, formData);
    if (result.ok) setMessage("");
    return result;
  }, INITIAL_STATE);

  return (
    <form action={formAction} className={`${cardClass} mt-6 max-w-xl`}>
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Send a WhatsApp message</p>
      {phones.length === 0 ? (
        <p className="text-sm text-slate-500">
          Save at least one WhatsApp number above, then you can send custom messages here.
        </p>
      ) : (
        <div className="grid gap-4">
          <label className="block">
            <span className={labelClass}>Message</span>
            <textarea
              name="message"
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message…"
              className={inputClass}
            />
          </label>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Send to</p>
            <div className="space-y-2">
              {phones.map((phone) => (
                <Checkbox key={phone} label={phone} name="phones" value={phone} defaultChecked />
              ))}
            </div>
          </div>
          {state.message ? (
            <p className={`text-sm font-medium ${state.ok ? "text-emerald-700" : "text-red-600"}`}>{state.message}</p>
          ) : null}
          <SubmitRow saveLabel="Send WhatsApp" />
        </div>
      )}
    </form>
  );
}
