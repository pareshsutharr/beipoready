import { LogoCloud } from "@/components/ui/logo-cloud-3";
import type { ClientLogoCard } from "@/lib/cms";

export default function ClientsMarquee({ clients }: { clients: ClientLogoCard[] }) {
  const logos = clients
    .filter((client) => client.logo_url)
    .map((client) => ({
      src: client.logo_url as string,
      alt: client.name,
      label: client.name,
    }));

  if (logos.length === 0) return null;

  return (
    <section
      className="relative w-full overflow-hidden bg-white py-20 sm:py-28"
      aria-labelledby="clients-heading"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold mb-3">
            Proof, Not Promises
          </p>
          <h2
            id="clients-heading"
            className="font-heading text-3xl sm:text-4xl font-bold text-[#0D4A6F]"
          >
            Real businesses. Real outcomes.
          </h2>
        </div>

        <div className="mx-auto mb-6 h-px max-w-sm bg-slate-200 [mask-image:linear-gradient(to_right,transparent,black,transparent)]" />

        <LogoCloud logos={logos} />

        <div className="mx-auto mt-6 h-px max-w-sm bg-slate-200 [mask-image:linear-gradient(to_right,transparent,black,transparent)]" />
      </div>
    </section>
  );
}
