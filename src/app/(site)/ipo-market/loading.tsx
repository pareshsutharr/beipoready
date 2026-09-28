export default function IpoMarketLoading() {
  return (
    <main>
      <section className="relative overflow-hidden bg-brand-navy py-16 sm:py-20">
        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_10%,#F59E0B_0,transparent_24%),radial-gradient(circle_at_80%_85%,#2563EB_0,transparent_27%)]" aria-hidden="true" />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-gold">Market intelligence</p>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-white sm:text-5xl">Live IPO Tracker</h1>
        </div>
      </section>
      <section className="bg-[#F6F9FC] py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="h-14 animate-pulse rounded-xl border border-slate-200 bg-white shadow-sm" />
          <div className="mt-6 h-10 w-64 animate-pulse rounded-lg bg-slate-200" />
          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="h-52 animate-pulse rounded-xl border border-slate-200 bg-slate-100" />
                ))}
              </div>
            </div>
            <div className="space-y-5">
              <div className="h-32 animate-pulse rounded-xl border border-slate-200 bg-white shadow-sm" />
              <div className="h-40 animate-pulse rounded-xl border border-slate-200 bg-white shadow-sm" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
