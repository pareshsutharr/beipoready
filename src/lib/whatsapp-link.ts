// Client for the linked-WhatsApp service (whatsapp/server.mjs), which sends from the admin's
// own WhatsApp account after a one-time QR scan in admin. Server-side only.

export type LinkedWhatsappStatus = {
  status: "starting" | "qr" | "connected" | "disconnected" | "offline";
  qr: string | null;
  me: string | null;
};

function serviceUrl(pathname: string) {
  return `http://127.0.0.1:${process.env.WHATSAPP_SERVICE_PORT || 3017}${pathname}`;
}

async function callService(pathname: string, init?: RequestInit) {
  const token = process.env.WHATSAPP_SERVICE_TOKEN;
  if (!token) throw new Error("WHATSAPP_SERVICE_TOKEN is not set.");
  const response = await fetch(serviceUrl(pathname), {
    ...init,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    cache: "no-store",
    signal: AbortSignal.timeout(60_000),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.error || `WhatsApp service error (${response.status})`);
  return data;
}

/** Never throws: a stopped service reports as "offline". */
export async function getLinkedWhatsappStatus(): Promise<LinkedWhatsappStatus> {
  try {
    return (await callService("/status")) as LinkedWhatsappStatus;
  } catch {
    return { status: "offline", qr: null, me: null };
  }
}

/** Sends from the linked WhatsApp account. Throws if it isn't linked or the number isn't on WhatsApp. */
export async function sendLinkedWhatsapp(phone: string, text: string) {
  await callService("/send", { method: "POST", body: JSON.stringify({ phone, text }) });
}

export async function unlinkWhatsapp() {
  await callService("/logout", { method: "POST" });
}
