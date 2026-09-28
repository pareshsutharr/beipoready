import { createHash, randomBytes, randomInt, timingSafeEqual } from "crypto";
import { SITE_URL } from "@/lib/seo";
import { connectToDatabase } from "@/lib/mongodb";
import { ContactOtp } from "@/models/ContactOtp";
import { getSmtpConfig, getTransporter } from "@/lib/email";
import { COMPANY_ADDRESS, escapeHtml, headingHtml, paragraphHtml, renderBrandedEmailHtml } from "@/lib/email-layout";

const OTP_TTL_MS = 10 * 60 * 1000;
const VERIFIED_WINDOW_MS = 30 * 60 * 1000;
const RESEND_COOLDOWN_MS = 45 * 1000;
const MAX_ATTEMPTS = 5;

/** User-facing OTP failures (rate limit, bad/expired code) — message is safe to show as-is. */
export class OtpError extends Error {}

function generateCode() {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

function hashCode(email: string, code: string) {
  return createHash("sha256").update(`${email}:${code}`).digest("hex");
}

function timingSafeEqualHex(a: string, b: string) {
  const bufA = Buffer.from(a, "hex");
  const bufB = Buffer.from(b, "hex");
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

async function sendOtpEmail(email: string, code: string) {
  const config = getSmtpConfig();
  const transporter = getTransporter();

  const contentHtml = [
    headingHtml("Verify your email"),
    paragraphHtml(
      "Use the code below to verify your email address on the Be IPO Ready contact form. This code expires in 10 minutes."
    ),
    `<p style="margin:0 0 20px;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:32px;font-weight:700;letter-spacing:6px;color:#0F2D52;">${code}</p>`,
    paragraphHtml("If you didn't request this, you can safely ignore this email."),
  ].join("");

  const html = renderBrandedEmailHtml({
    preheader: `Your verification code is ${code}`,
    contentHtml,
    footerHtml: escapeHtml(COMPANY_ADDRESS),
    logoUrl: `${SITE_URL}/logo-transparent.png`,
    siteUrl: SITE_URL,
  });

  const from = config.from.includes("<") ? config.from : `Be IPO Ready <${config.from}>`;

  await transporter.sendMail({
    from,
    to: email,
    subject: `Your verification code is ${code}`,
    text: `Your Be IPO Ready verification code is ${code}. It expires in 10 minutes.`,
    html,
  });
}

/** Generates and emails a fresh OTP for `email`, rate-limited to one send per RESEND_COOLDOWN_MS. */
export async function requestContactOtp(email: string) {
  await connectToDatabase();
  const normalized = email.trim().toLowerCase();

  const recent = await ContactOtp.findOne({ email: normalized }).sort({ created_at: -1 });
  if (recent && Date.now() - recent.get("created_at").getTime() < RESEND_COOLDOWN_MS) {
    throw new OtpError("Please wait a moment before requesting another code.");
  }

  const code = generateCode();
  await ContactOtp.create({
    email: normalized,
    code_hash: hashCode(normalized, code),
    expires_at: new Date(Date.now() + OTP_TTL_MS),
  });

  await sendOtpEmail(normalized, code);
}

/** Verifies `code` for `email` and returns a one-time token proving verification, for the lead submission to present. */
export async function verifyContactOtp(email: string, code: string): Promise<string> {
  await connectToDatabase();
  const normalized = email.trim().toLowerCase();

  const otp = await ContactOtp.findOne({ email: normalized, verified: false, consumed: false }).sort({
    created_at: -1,
  });

  if (!otp || otp.expires_at.getTime() < Date.now()) {
    throw new OtpError("That code has expired. Please request a new one.");
  }

  if (otp.attempts >= MAX_ATTEMPTS) {
    throw new OtpError("Too many incorrect attempts. Please request a new code.");
  }

  if (!timingSafeEqualHex(hashCode(normalized, code), otp.code_hash)) {
    otp.attempts += 1;
    await otp.save();
    throw new OtpError("Incorrect code. Please try again.");
  }

  const token = randomBytes(24).toString("hex");
  otp.verified = true;
  otp.verify_token = token;
  otp.expires_at = new Date(Date.now() + VERIFIED_WINDOW_MS);
  await otp.save();

  return token;
}

/** Consumes a verify token issued by verifyContactOtp — single use, tied to the same email. */
export async function consumeContactOtpToken(email: string, token: string): Promise<boolean> {
  await connectToDatabase();
  const normalized = email.trim().toLowerCase();

  const otp = await ContactOtp.findOne({ email: normalized, verify_token: token, verified: true, consumed: false });
  if (!otp || otp.expires_at.getTime() < Date.now()) return false;

  otp.consumed = true;
  await otp.save();
  return true;
}
