import Image from "next/image";

const CAPABILITIES = [
  {
    title: "Readiness",
    text: "Gap checks and clear priorities before listing.",
  },
  {
    title: "Advisory",
    text: "Governance and investor narrative support.",
  },
  {
    title: "Execution",
    text: "Coordinated action across listing teams.",
  },
];

export default function PathwaySection() {
  return (
    <section
      className="relative flex min-h-[80vh] w-full items-center overflow-hidden bg-[#FEFBF2]"
      aria-label="Who we are"
    >
      <div className="mx-auto grid w-full max-w-[1040px] grid-cols-1 items-center gap-8 px-6 py-12 md:grid-cols-[0.98fr_1.02fr] md:px-10 lg:px-12">
        <div className="relative z-10 max-w-[380px] md:pl-1">
          <div className="mb-16">
            <div className="flex items-center gap-2">
              <h2 className="font-sans text-[1.75rem] font-normal leading-[0.88] text-[#0D4A6F]">
                Who
              </h2>
              <span className="mt-1 h-px w-[52px] bg-[#0D4A6F]" />
              <span className="mt-1 h-1 w-1 rounded-full bg-[#ECB85B]" />
            </div>
            <p className="-mt-1 font-sans text-[2rem] font-bold leading-none text-[#ECB85B]">
              we are
            </p>
          </div>

          <div className="mb-6 max-w-[300px]">
            <p className="text-[1.08rem] font-semibold leading-snug text-[#0D4A6F]">
              Practical IPO preparation for growing businesses.
            </p>
            <p className="mt-1 text-[1.08rem] font-semibold leading-snug text-[#0D4A6F]">
              Built for founders, boards, and finance teams.
            </p>
          </div>

          <p className="mb-7 max-w-[320px] text-[0.84rem] leading-[1.72] text-slate-500">
            We work with ambitious companies that want to enter the public
            markets with stronger governance, cleaner numbers, sharper investor
            communication, and a practical listing roadmap.
          </p>

          <div className="grid max-w-[342px] grid-cols-3 gap-2">
            {CAPABILITIES.map((item) => (
              <article
                key={item.title}
                className="min-h-[98px] rounded-md border border-[#F2EBDD] bg-[#FEFBF2] px-2.5 py-3 shadow-[0_2px_4px_rgba(15,45,82,0.22)]"
              >
                <h3 className="mb-2 text-[0.66rem] font-bold uppercase tracking-[0.07em] text-[#0D4A6F]">
                  {item.title}
                </h3>
                <p className="text-[0.68rem] leading-[1.5] text-slate-500">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="relative mx-auto flex w-full max-w-[430px] justify-center md:justify-end">
          <Image
            src="/whoami-hq.png"
            alt="Advisory team discussing IPO readiness"
            width={1376}
            height={1632}
            className="h-auto w-[500px] max-w-full object-contain"
            sizes="(min-width: 768px) 500px, 100vw"
            priority={false}
          />
        </div>
      </div>
    </section>
  );
}
