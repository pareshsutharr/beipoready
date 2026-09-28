import { NextResponse } from "next/server";
import { requestContactOtp, OtpError } from "@/lib/contact-otp";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { email?: unknown } | null;
  const email = typeof body?.email === "string" ? body.email.trim() : "";

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  try {
    await requestContactOtp(email);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof OtpError) {
      return NextResponse.json({ error: error.message }, { status: 429 });
    }
    console.error("Contact OTP send failed:", error);
    return NextResponse.json({ error: "Could not send a verification code. Please try again." }, { status: 500 });
  }
}
