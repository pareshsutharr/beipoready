import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Terms & Conditions",
  description: "Terms and Conditions governing use of the Be IPO Ready website and services.",
  path: "/terms-and-conditions",
});

export default function TermsPage() {
  return (
    <main className="bg-brand-cream py-16 sm:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-brand-navy mb-2">Terms &amp; Conditions</h1>
        <p className="font-sans text-sm text-slate-400 mb-10">Last updated: June 2026</p>

        <div className="font-sans text-slate-700 leading-relaxed space-y-8">

          <section>
            <h2 className="font-heading text-xl font-bold text-brand-navy mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using beipoready.com (&ldquo;Site&rdquo;), you agree to be bound by these Terms
              and Conditions. If you do not agree to all the terms and conditions, you may not access or use the Site.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold text-brand-navy mb-3">2. Use of the Site</h2>
            <p>You agree to use this Site only for lawful purposes and in a manner consistent with all applicable laws and regulations. You must not:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Use the Site in any way that violates applicable local, national, or international laws or regulations.</li>
              <li>Transmit any unsolicited commercial communications.</li>
              <li>Attempt to gain unauthorised access to any part of the Site or its related systems.</li>
              <li>Reproduce, duplicate, or copy any part of the Site without our prior written consent.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold text-brand-navy mb-3">3. Intellectual Property</h2>
            <p>
              All content on this Site, including text, graphics, logos, and software, is the property
              of Be IPO Ready / Jainam Capital Advisors and is protected by applicable copyright and
              intellectual property laws. You may not use any content without our express written permission.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold text-brand-navy mb-3">4. Disclaimer of Warranties</h2>
            <p>
              The information on this Site is provided &ldquo;as is&rdquo; without any warranties, express or
              implied. We do not warrant that the Site will be uninterrupted or error-free, or that
              information on the Site is complete, accurate, or up to date.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold text-brand-navy mb-3">5. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Be IPO Ready / Jainam Capital Advisors shall not
              be liable for any indirect, incidental, special, consequential, or punitive damages arising
              from your use of, or inability to use, the Site or our services.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold text-brand-navy mb-3">6. Third-Party Links</h2>
            <p>
              This Site may contain links to third-party websites. These links are provided for your
              convenience only. We have no control over those sites and accept no responsibility for them
              or for any loss or damage that may arise from your use of them.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold text-brand-navy mb-3">7. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of India. Any
              disputes arising under or in connection with these Terms shall be subject to the exclusive
              jurisdiction of the courts of Mumbai, Maharashtra.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold text-brand-navy mb-3">8. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. Changes are effective immediately
              upon posting to the Site. Your continued use of the Site following any changes constitutes
              your acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold text-brand-navy mb-3">9. Contact</h2>
            <p>
              For questions about these Terms, contact us at info@beipoready.com.
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}
