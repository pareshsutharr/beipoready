import { NextResponse, after } from "next/server";
import { sendBulkEmail } from "@/lib/email";
import { getEffectiveTemplate } from "@/lib/email-template-store";
import { connectToDatabase } from "@/lib/mongodb";
import { Lead } from "@/models/Lead";
import { EmailTrackingEvent } from "@/models/EmailTrackingEvent";
import { NewsletterSubscriber } from "@/models/NewsletterSubscriber";
import { subscribeToNewsletter } from "@/lib/newsletter";
import { notifyAdmin } from "@/lib/notify-admin";
import { LEAD_SOURCE_LABELS, isLeadSource } from "@/lib/lead-meta";
import { consumeContactOtpToken } from "@/lib/contact-otp";
import { nextLeadSerial } from "@/lib/lead-serial";

type LeadRequestBody = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  company_name?: unknown;
  service_interest?: unknown;
  message?: unknown;
  source?: unknown;
  readiness_score?: unknown;
  issue_size_estimate?: unknown;
  otp_token?: unknown;
};

function stringOrNull(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

/** Best-effort: sends the welcome email and records the result, but never throws into the caller. */
async function sendNewsletterWelcomeEmail(subscriberId: string, email: string, unsubscribeToken: string) {
  const welcome = await getEffectiveTemplate("welcome");

  try {
    const result = await sendBulkEmail({
      recipients: [email],
      subject: welcome.subject,
      body: welcome.body,
      format: welcome.format,
      track: true,
      unsubscribeTokens: { [email]: unsubscribeToken },
    });
    const recipientResult = result.recipientResults[0] ?? null;

    if (recipientResult?.trackingToken) {
      await EmailTrackingEvent.create({
        token: recipientResult.trackingToken,
        email,
        kind: "welcome",
        campaign_id: null,
      });
    }

    await NewsletterSubscriber.updateOne(
      { _id: subscriberId },
      {
        $set: {
          welcome_email: {
            status: recipientResult?.status ?? "failed",
            sent_at: new Date(),
            message_id: recipientResult?.messageId ?? null,
            error: recipientResult?.error ?? null,
            attempts: recipientResult?.attempts ?? 0,
          },
        },
      }
    );
  } catch (error) {
    console.error("Newsletter welcome email failed:", error);
    await NewsletterSubscriber.updateOne(
      { _id: subscriberId },
      {
        $set: {
          welcome_email: {
            status: "failed",
            sent_at: new Date(),
            message_id: null,
            error: error instanceof Error ? error.message : "Welcome email failed.",
            attempts: 1,
          },
        },
      }
    ).catch(() => {});
  }
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as LeadRequestBody | null;

  const name = stringOrNull(body?.name);
  const email = stringOrNull(body?.email);
  const source = stringOrNull(body?.source);

  if (!name || !email || !source) {
    return NextResponse.json({ error: "name, email, and source are required." }, { status: 400 });
  }

  if (source === "contact" || source === "services") {
    const otpToken = stringOrNull(body?.otp_token);
    if (!otpToken || !(await consumeContactOtpToken(email, otpToken))) {
      return NextResponse.json({ error: "Please verify your email before submitting." }, { status: 400 });
    }
  }

  try {
    await connectToDatabase();
    const serialNumber = source === "newsletter" ? null : await nextLeadSerial();
    const lead = await Lead.create({
      serial_number: serialNumber,
      name,
      email,
      phone: stringOrNull(body?.phone),
      company_name: stringOrNull(body?.company_name),
      service_interest: stringOrNull(body?.service_interest),
      message: stringOrNull(body?.message),
      source,
      readiness_score: typeof body?.readiness_score === "number" ? body.readiness_score : null,
      issue_size_estimate: stringOrNull(body?.issue_size_estimate),
    });

    if (source === "newsletter") {
      const { subscriber, alreadySubscribed } = await subscribeToNewsletter(email, String(lead._id));

      if (!alreadySubscribed) {
        // Best-effort, after the response: a welcome email failing (e.g. SMTP not configured) must not fail the signup.
        after(() => sendNewsletterWelcomeEmail(String(subscriber._id), subscriber.email, subscriber.unsubscribe_token));
        after(() =>
          notifyAdmin("newsletter", `New newsletter subscriber: ${email}`, {
            Name: name,
            Email: email,
          })
        );
      }

      return NextResponse.json({ ok: true, alreadySubscribed });
    }

    after(() =>
      notifyAdmin(
        "lead",
        `[${serialNumber}] New ${isLeadSource(source) ? LEAD_SOURCE_LABELS[source] : source} enquiry: ${name}`,
        {
          "Lead No": serialNumber,
          Name: name,
          Email: email,
          Phone: stringOrNull(body?.phone),
          Company: stringOrNull(body?.company_name),
          "Service interest": stringOrNull(body?.service_interest),
          Message: stringOrNull(body?.message),
          Source: source,
          "Readiness score": typeof body?.readiness_score === "number" ? body.readiness_score : null,
          "Issue size estimate": stringOrNull(body?.issue_size_estimate),
        }
      )
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
