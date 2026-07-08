import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Be IPO Ready — how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-brand-cream py-16 sm:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-brand-navy mb-2">Privacy Policy</h1>
        <p className="font-sans text-sm text-slate-400 mb-10">Last updated: June 2026</p>

        <div className="prose prose-slate max-w-none font-sans text-slate-700 leading-relaxed space-y-8">

          <section>
            <h2 className="font-heading text-xl font-bold text-brand-navy mb-3">1. Introduction</h2>
            <p>
              Be IPO Ready / Jainam Capital Advisors (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is committed to
              protecting your privacy. This Privacy Policy explains how we collect, use, disclose,
              and safeguard your information when you visit beipoready.com or use our services.
              Please read this policy carefully. If you disagree with its terms, please discontinue use of our site.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold text-brand-navy mb-3">2. Information We Collect</h2>
            <p>We collect information in the following ways:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong>Information you provide directly</strong> — name, email address, phone number, company name, and any message content you submit via our contact form, lead capture forms, or newsletter signup.</li>
              <li><strong>Tool usage data</strong> — responses you provide in our IPO Readiness Tool and Issue Size Calculator, which help us tailor our advisory to your situation.</li>
              <li><strong>Automatically collected data</strong> — IP address, browser type, pages visited, and time spent on pages, collected via cookies and similar technologies.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold text-brand-navy mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To respond to your enquiries and provide our advisory services.</li>
              <li>To send you relevant educational content, insights, and service updates (where you have opted in).</li>
              <li>To improve the functionality and content of our website.</li>
              <li>To comply with applicable legal and regulatory requirements.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold text-brand-navy mb-3">4. Sharing Your Information</h2>
            <p>
              We do not sell, trade, or rent your personal information to third parties. We may share your
              information with trusted service providers who assist us in operating our website and
              conducting our business, provided those parties agree to keep this information confidential.
              We may also disclose your information when required by law or to protect our legal rights.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold text-brand-navy mb-3">5. Data Retention</h2>
            <p>
              We retain personal information for as long as is necessary to provide our services and
              comply with our legal obligations. You may request deletion of your personal data at any
              time by contacting us at info@beipoready.com.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold text-brand-navy mb-3">6. Cookies</h2>
            <p>
              Our website uses cookies to enhance your browsing experience. You can instruct your browser
              to refuse all cookies or to indicate when a cookie is being sent. However, some parts of
              our website may not function properly without cookies.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold text-brand-navy mb-3">7. Your Rights</h2>
            <p>
              Under applicable data protection laws, you have the right to access, correct, or delete
              your personal data; to object to or restrict processing; and to lodge a complaint with the
              relevant supervisory authority. To exercise any of these rights, please email us at
              info@beipoready.com.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold text-brand-navy mb-3">8. Contact</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at:<br />
              <strong>Email:</strong> info@beipoready.com<br />
              <strong>Address:</strong> Mumbai / Jaipur, India
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}
