import { randomUUID } from "crypto";
import { NewsletterSubscriber } from "@/models/NewsletterSubscriber";

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

type SubscribeResult = {
  subscriber: InstanceType<typeof NewsletterSubscriber>;
  /** True when this email has never subscribed before. */
  isNew: boolean;
  /** True when an unsubscribed record was reactivated. */
  reactivated: boolean;
  /** True when the email was already an active subscriber — no welcome email should be sent. */
  alreadySubscribed: boolean;
};

/** Case-insensitively subscribes an email, reactivating a prior unsubscribe if present. Idempotent for active subscribers. */
export async function subscribeToNewsletter(email: string, leadId?: string | null): Promise<SubscribeResult> {
  const normalized = normalizeEmail(email);
  const existing = await NewsletterSubscriber.findOne({ email: normalized });

  if (!existing) {
    const subscriber = await NewsletterSubscriber.create({
      email: normalized,
      status: "subscribed",
      lead_id: leadId ?? null,
    });
    return { subscriber, isNew: true, reactivated: false, alreadySubscribed: false };
  }

  if (existing.status === "subscribed") {
    return { subscriber: existing, isNew: false, reactivated: false, alreadySubscribed: true };
  }

  existing.status = "subscribed";
  existing.subscribed_at = new Date();
  existing.unsubscribed_at = null;
  existing.unsubscribe_token = randomUUID();
  if (leadId) existing.lead_id = leadId as unknown as InstanceType<typeof NewsletterSubscriber>["lead_id"];
  await existing.save();

  return { subscriber: existing, isNew: false, reactivated: true, alreadySubscribed: false };
}

type UnsubscribeResult = { status: "unsubscribed" | "already_unsubscribed" | "invalid_token" };

export async function unsubscribeByToken(token: string): Promise<UnsubscribeResult> {
  const subscriber = await NewsletterSubscriber.findOne({ unsubscribe_token: token });
  if (!subscriber) return { status: "invalid_token" };

  if (subscriber.status === "unsubscribed") {
    return { status: "already_unsubscribed" };
  }

  subscriber.status = "unsubscribed";
  subscriber.unsubscribed_at = new Date();
  await subscriber.save();

  return { status: "unsubscribed" };
}
