import Link from "next/link";

const COMPARISON = [
  {
    label: "Best suited for",
    sme: "Smaller, growing companies",
    main: "Larger, established companies",
  },
  {
    label: "Eligibility",
    sme: "Lighter thresholds — post-issue paid-up capital up to ₹25 Cr",
    main: "Higher thresholds for profitability, net worth and capital",
  },
  {
    label: "Typical issue size",
    sme: "Smaller issues",
    main: "Larger issues",
  },
  {
    label: "Investor base",
    sme: "Retail & HNI participation with mandatory market making",
    main: "Broad institutional and retail participation",
  },
  {
    label: "Path forward",
    sme: "Can migrate to the Main Board as the company grows",
    main: "Direct access to the widest market",
  },
];

export default function SmeVsMainBoard() {
  return (
    <section className="w-full py-16 sm:py-20 bg-white" aria-labelledby="sme-vs-main-heading">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          id="sme-vs-main-heading"
          className="font-heading text-xl sm:text-2xl font-bold text-[#0D4A6F] text-center mb-6"
        >
          SME IPO vs Main Board IPO — which path fits you?
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-sm text-left">
            <thead>
              <tr style={{ background: "#0D4A6F" }}>
                <th scope="col" className="px-5 py-3.5 font-bold text-white/70 w-[26%]"></th>
                <th scope="col" className="px-5 py-3.5 font-bold text-white">
                  SME IPO <span className="font-medium text-white/60">(NSE Emerge / BSE SME)</span>
                </th>
                <th scope="col" className="px-5 py-3.5 font-bold text-white">Main Board IPO</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row, i) => (
                <tr key={row.label} style={{ background: i % 2 ? "#FEFBF2" : "#fff" }}>
                  <th scope="row" className="px-5 py-4 font-bold text-[#0D4A6F] align-top">{row.label}</th>
                  <td className="px-5 py-4 text-slate-600 align-top">{row.sme}</td>
                  <td className="px-5 py-4 text-slate-600 align-top">{row.main}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-center text-sm text-slate-500 mt-5">
          Not sure which applies to you?{" "}
          <Link href="/contact-us" className="font-bold text-brand-gold hover:underline">
            Book an IPO Readiness Call
          </Link>{" "}
          and we&rsquo;ll help you choose.
        </p>
      </div>
    </section>
  );
}
