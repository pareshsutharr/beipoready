import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Unsubscribed",
  description: "Confirm your newsletter unsubscribe status for Be IPO Ready.",
  path: "/newsletter-unsubscribed",
});

export default async function NewsletterUnsubscribedPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const isInvalid = status === "invalid";

  return (
    <div className="bg-brand-cream py-20 sm:py-28">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {isInvalid ? (
          <>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-brand-navy mb-3">
              That unsubscribe link isn&rsquo;t valid
            </h1>
            <p className="font-sans text-slate-600 leading-relaxed">
              This link may have already been used or has expired. If you&rsquo;re still receiving emails
              you&rsquo;d like to stop, reply to any of our emails and we&rsquo;ll remove you manually.
            </p>
          </>
        ) : (
          <>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-brand-navy mb-3">
              You&rsquo;ve been unsubscribed
            </h1>
            <p className="font-sans text-slate-600 leading-relaxed">
              You won&rsquo;t receive any further newsletter emails from Be IPO Ready. You can re-subscribe
              anytime from the site footer.
            </p>
          </>
        )}

        <Link
          href="/"
          className="mt-8 inline-block font-sans text-sm font-semibold text-brand-navy underline hover:text-brand-gold transition-colors"
        >
          Return to homepage
        </Link>
      </div>
    </div>
  );
}
