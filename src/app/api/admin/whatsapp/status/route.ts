import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getLinkedWhatsappStatus } from "@/lib/whatsapp-link";

// Polled by the admin Notifications page to show the QR code / linked state.
export async function GET() {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(await getLinkedWhatsappStatus());
}
