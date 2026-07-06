"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import type { ClientLogoCard } from "@/lib/cms";

// Real BEIPOREADY clients — swap in actual logos via the admin CMS
// (clients table); monogram tiles render until a logo_url is provided.
type ClientTile = Omit<ClientLogoCard, "logo_url"> & { logo_url: string | null };

const FALLBACK_CLIENTS: ClientTile[] = [
  { name: "Aaron", logo_url: null, website_url: null },
  { name: "IBL", logo_url: null, website_url: null },
  { name: "Zorko", logo_url: null, website_url: null },
  { name: "Rem Electromach", logo_url: null, website_url: null },
  { name: "Orange", logo_url: null, website_url: null },
  { name: "Wok on Fire", logo_url: null, website_url: null },
  { name: "Candor", logo_url: null, website_url: null },
  { name: "Express", logo_url: null, website_url: null },
  { name: "Zestika", logo_url: null, website_url: null },
  { name: "Vijya Finetech", logo_url: null, website_url: null },
  { name: "Deciml", logo_url: null, website_url: null },
];

function ClientLogoTile({ client }: { client: ClientTile }) {
  const tile = (
    <div className="flex h-[270px] w-full flex-col items-center justify-center rounded-[30px] bg-[#FFFDF6] px-8 pb-9 pt-8 shadow-[0_3px_18px_rgba(15,45,82,0.15)] ring-1 ring-[#F1EBDD]" >
      <div className="flex h-[126px] w-[126px] items-center justify-center rounded-full bg-[#FFFDF6] p-3 shadow-[0_7px_16px_rgba(15,45,82,0.14),inset_0_1px_1px_rgba(255,255,255,0.95)] ring-1 ring-[#F1EBDD]">
        <div className="flex h-[104px] w-[104px] items-center justify-center rounded-full bg-white p-4 shadow-[inset_0_0_0_1px_rgba(15,45,82,0.03)]">
          {client.logo_url ? (
            <img
              src={client.logo_url}
              alt={`${client.name} logo`}
              className="max-h-[76px] max-w-[84px] object-contain"
            />
          ) : (
            <span className="font-serif text-4xl font-bold text-[#0D4A6F]" aria-hidden="true">
              {client.name.charAt(0)}
            </span>
          )}
        </div>
      </div>

      <div className="mt-[28px] max-w-[150px] text-center">
        <h3 className="text-[0.72rem] font-bold uppercase tracking-[0.08em] text-[#0D4A6F] leading-snug">
          {client.name}
        </h3>
      </div>
    </div>
  );

  if (!client.website_url) return tile;

  return (
    <a
      href={client.website_url}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
      aria-label={client.name}
    >
      {tile}
    </a>
  );
}

function Case({ clients }: { clients: ClientLogoCard[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const items = useMemo(() => {
    const source = clients.length ? clients : FALLBACK_CLIENTS;
    const repeatCount = Math.ceil(12 / source.length);

    return Array.from({ length: repeatCount }, () => source).flat();
  }, [clients]);

  useEffect(() => {
    if (!api || items.length <= 1) return;

    const timer = window.setInterval(() => {
      api.scrollNext();
    }, 1900);

    return () => window.clearInterval(timer);
  }, [api, items.length]);

  return (
    <section
      className="relative w-full overflow-hidden bg-[#FEFBF2] py-20 sm:py-28"
      aria-labelledby="clients-heading"
    >
      <div className="mx-auto w-full max-w-[1040px] px-6 md:px-10 lg:px-12">
        <div className="mb-[70px] text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold mb-3">
            Proof, Not Promises
          </p>
          <h2
            id="clients-heading"
            className="font-serif text-3xl sm:text-4xl font-bold text-[#0D4A6F]"
          >
            Real businesses. Real outcomes.
          </h2>
        </div>

        <Carousel
          setApi={setApi}
          opts={{ align: "start", loop: true, dragFree: false }}
          className="w-[calc(100%+190px)]"
        >
          <CarouselContent className="-ml-[30px] py-8">
            {items.map((client, index) => (
              <CarouselItem
                className="pl-[30px]"
                style={{ flex: "0 0 244px" }}
                key={`${client.name}-${index}`}
              >
                <ClientLogoTile client={client} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}

export { Case };
