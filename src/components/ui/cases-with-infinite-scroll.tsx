"use client";

import { useEffect, useMemo, useState } from "react";
import { Carousel, type CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import type { ClientLogoCard } from "@/lib/cms";

function ClientLogoTile({ client }: { client: ClientLogoCard }) {
  const tile = (
    <div
      className="flex h-24 items-center justify-center rounded-2xl px-5 py-4 group"
      style={{ border: "1px solid rgba(15,45,82,0.1)", background: "#fff", transition: "box-shadow 0.3s, border-color 0.3s, transform 0.3s" }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.boxShadow = "0 8px 32px rgba(245,158,11,0.15)";
        el.style.borderColor = "rgba(245,158,11,0.5)";
        el.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.boxShadow = "none";
        el.style.borderColor = "rgba(15,45,82,0.1)";
        el.style.transform = "translateY(0)";
      }}
    >
      <div className="h-full w-full bg-contain bg-center bg-no-repeat opacity-70 hover:opacity-100 transition-opacity duration-300"
        style={{ backgroundImage: `url("${client.logo_url}")` }} role="img" aria-label={`${client.name} logo`} />
    </div>
  );

  if (!client.website_url) return tile;
  return (
    <a href={client.website_url} target="_blank" rel="noopener noreferrer" className="block" aria-label={client.name}>
      {tile}
    </a>
  );
}

function Case({ clients }: { clients: ClientLogoCard[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const items = useMemo(() => {
    if (clients.length >= 8) return clients;
    return Array.from({ length: Math.ceil(8 / Math.max(clients.length, 1)) }, () => clients).flat();
  }, [clients]);

  useEffect(() => {
    if (!api || items.length <= 1) return;
    const timer = setTimeout(() => {
      const isLast = api.selectedScrollSnap() + 1 === api.scrollSnapList().length;
      if (isLast) { setCurrent(0); api.scrollTo(0); }
      else { api.scrollNext(); setCurrent((v) => v + 1); }
    }, 1800);
    return () => clearTimeout(timer);
  }, [api, current, items.length]);

  if (!clients.length) return null;

  return (
    <section className="w-full py-20 sm:py-24 bg-brand-cream relative overflow-hidden" aria-labelledby="clients-heading">
      {/* Subtle top/bottom rules */}
      <div className="absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(15,45,82,0.15),transparent)" }} aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(15,45,82,0.15),transparent)" }} aria-hidden="true" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold mb-3">Our Clients</p>
            <h2 id="clients-heading" className="font-serif text-3xl sm:text-4xl font-bold text-brand-navy leading-tight">
              Trusted by growth-stage businesses preparing for public markets
            </h2>
          </div>

          <Carousel setApi={setApi} opts={{ align: "start", loop: false }} className="w-full">
            <CarouselContent>
              {items.map((client, index) => (
                <CarouselItem className="basis-1/2 sm:basis-1/3 lg:basis-1/5" key={`${client.name}-${index}`}>
                  <ClientLogoTile client={client} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
}

export { Case };
