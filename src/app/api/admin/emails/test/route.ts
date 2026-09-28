import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { sendBulkEmail } from "@/lib/email";

export async function POST() {
  const admin = await getAdminSession();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await sendBulkEmail({
      recipients: [admin.email],
      subject: "Be IPO Ready — test email",
      body: `This is a test email from the admin Email Center, confirming SMTP delivery is working.\n\nSent to: ${admin.email}`,
    });

    const recipientResult = result.recipientResults[0] ?? null;

    if (!recipientResult || recipientResult.status !== "sent") {
      return NextResponse.json(
        { error: recipientResult?.error || "Test email was not accepted by the SMTP server." },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true, messageId: recipientResult.messageId });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Test email failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
