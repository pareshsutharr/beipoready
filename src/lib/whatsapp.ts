// WhatsApp alerts via CallMeBot (free, personal-use API — it can only message a
// number that has opted in by sending "I allow callmebot to send me messages" to
// the bot, which replies with that number's API key).
// Docs: https://www.callmebot.com/blog/free-api-whatsapp-messages/

const CALLMEBOT_URL = "https://api.callmebot.com/whatsapp.php";

export type WhatsappRecipient = { phone: string; api_key: string };

/** Keeps digits with a leading "+"; a bare 10-digit number is treated as Indian (+91). */
export function normalizeWhatsappNumber(raw: string) {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  return digits.length === 10 ? `+91${digits}` : `+${digits}`;
}

/**
 * Parses the admin textarea: one recipient per line as "number, api key" (comma or space
 * separated). A line with no key is kept so the admin can list a number before it has opted in;
 * it's just skipped when sending. Deduped by number.
 */
export function parseWhatsappRecipients(raw: string): WhatsappRecipient[] {
  const byPhone = new Map<string, WhatsappRecipient>();
  for (const line of raw.split("\n")) {
    const match = line.trim().match(/^([+\d][\d\s()-]*\d)\s*[,;:\s]\s*(\S*)$|^([+\d][\d\s()-]*\d)$/);
    if (!match) continue;
    const phone = normalizeWhatsappNumber(match[1] ?? match[3]);
    if (phone.length < 9) continue;
    byPhone.set(phone, { phone, api_key: (match[2] ?? "").trim() });
  }
  return Array.from(byPhone.values());
}

export function formatWhatsappRecipients(recipients: WhatsappRecipient[]) {
  return recipients.map((r) => (r.api_key ? `${r.phone}, ${r.api_key}` : r.phone)).join("\n");
}

/** Sends one WhatsApp message. Throws on failure so callers can decide how to handle it. */
export async function sendWhatsappMessage(phone: string, apiKey: string, text: string) {
  const url = new URL(CALLMEBOT_URL);
  url.searchParams.set("phone", phone);
  url.searchParams.set("apikey", apiKey);
  url.searchParams.set("text", text);

  const response = await fetch(url, { signal: AbortSignal.timeout(15_000), cache: "no-store" });
  const body = await response.text();
  // CallMeBot answers 200 with an HTML page even for some errors, so check the text too.
  if (!response.ok || /apikey is invalid|invalid apikey|not activated/i.test(body)) {
    throw new Error(`CallMeBot WhatsApp send failed (${response.status}): ${body.replace(/<[^>]+>/g, " ").trim().slice(0, 200)}`);
  }
}

/**
 * Sends one text to each recipient, using the linked WhatsApp account when it's connected
 * (any number works) and falling back to CallMeBot for numbers that have an API key.
 * Never throws; returns the numbers that failed with the reason.
 */
export async function deliverWhatsapp(recipients: WhatsappRecipient[], text: string) {
  const { getLinkedWhatsappStatus, sendLinkedWhatsapp } = await import("@/lib/whatsapp-link");
  const linked = (await getLinkedWhatsappStatus()).status === "connected";

  const results = await Promise.allSettled(
    recipients.map((r) => {
      if (linked) return sendLinkedWhatsapp(r.phone, text);
      if (r.api_key) return sendWhatsappMessage(r.phone, r.api_key, text);
      return Promise.reject(new Error("WhatsApp is not linked and this number has no CallMeBot key."));
    })
  );

  const failed = recipients.flatMap((r, i) => {
    const result = results[i];
    return result.status === "rejected"
      ? [{ phone: r.phone, error: result.reason instanceof Error ? result.reason.message : String(result.reason) }]
      : [];
  });
  return { sent: recipients.length - failed.length, failed };
}
