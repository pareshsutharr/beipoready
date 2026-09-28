import { NextResponse } from "next/server";
import { verifyContactOtp, OtpError } from "@/lib/contact-otp";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CODE_RE = /^\d{6}$/;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { email?: unknown; code?: unknown } | null;
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const code = typeof body?.code === "string" ? body.code.trim() : "";

  if (!email || !EMAIL_RE.test(email) || !CODE_RE.test(code)) {
    return NextResponse.json({ error: "Enter the 6-digit code sent to your email." }, { status: 400 });
  }

  try {
    const token = await verifyContactOtp(email, code);
    return NextResponse.json({ ok: true, token });
  } catch (error) {
    if (error instanceof OtpError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("Contact OTP verify failed:", error);
    return NextResponse.json({ error: "Could not verify the code. Please try again." }, { status: 500 });
  }
}
