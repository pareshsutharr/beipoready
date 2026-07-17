"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import type { ClientLogoCard } from "@/lib/cms";

// Real BEIPOREADY clients, swap in actual logos via the admin CMS
// (clients table); monogram tiles render until a logo_url is provided.
type ClientTile = Omit<ClientLogoCard, "logo_url"> & { logo_url: string | null };

const FALLBACK_CLIENTS: ClientTile[] = [
  { name: "Aaron Industries", nature_of_business: "Capital Goods (Elevators Manufacturers)", logo_url: null, website_url: null },
  { name: "IBL Finance", nature_of_business: "NBFC", logo_url: null, website_url: null },
  { name: "Zorko", nature_of_business: "Quick Service Restaurant (QSR)", logo_url: null, website_url: null },
  { name: "REM Electricals", nature_of_business: "Capital Goods (Automation Panel)", logo_url: null, website_url: null },
  { name: "Aarya Automobiles", nature_of_business: "EV Motorcycles", logo_url: null, website_url: null },
  { name: "Cruizine Healthcare", nature_of_business: "Medical Equipments (Surgical Products)", logo_url: null, website_url: null },
  { name: "Candor IVF Hospital", nature_of_business: "IVF Centres/Hospital", logo_url: null, website_url: null },
  { name: "Express Electro Elevators", nature_of_business: "Elevator Installers", logo_url: null, website_url: null },
  { name: "Zestika Spices", nature_of_business: "Black Pepper Manufacturer", logo_url: null, website_url: null },
  { name: "Paramount Looms Pvt. Ltd.", nature_of_business: "Textile Machine Manufacturer", logo_url: null, website_url: null },
  { name: "Moonstar Lifecare Pvt. Ltd.", nature_of_business: "Healthcare Marketing company", logo_url: null, website_url: null },
  { name: "Olpad Aqua Ltd", nature_of_business: "Aqua Products", logo_url: null, website_url: null },
  { name: "P.P Maniya Hospital", nature_of_business: "Multi Speciality Hospital", logo_url: null, website_url: null },
  { name: "Arham Wealth Management Private Limited", nature_of_business: "Stock Broker", logo_url: null, website_url: null },
];

function ClientLogoTile({ client }: { client: ClientTile }) {
  const tile = (
    <div className="flex h-[300px] w-full flex-col items-center justify-center rounded-[30px] bg-[#FFFDF6] px-7 pb-9 pt-8 shadow-[0_3px_18px_rgba(15,45,82,0.15)] ring-1 ring-[#F1EBDD]" >
      <div className="flex h-[126px] w-[126px] items-center justify-center rounded-full bg-[#FFFDF6] p-3 shadow-[0_7px_16px_rgba(15,45,82,0.14),inset_0_1px_1px_rgba(255,255,255,0.95)] ring-1 ring-[#F1EBDD]">
        <div className="flex h-[104px] w-[104px] items-center justify-center rounded-full bg-white p-4 shadow-[inset_0_0_0_1px_rgba(15,45,82,0.03)]">
          {client.logo_url ? (
            <img
              src={client.logo_url}
              alt={`${client.name} logo`}
              className="max-h-[76px] max-w-[84px] object-contain"
            />
          ) : (
            <span className="font-heading text-4xl font-bold text-[#0D4A6F]" aria-hidden="true">
              {client.name.charAt(0)}
            </span>
          )}
        </div>
      </div>

      <div className="mt-[24px] max-w-[170px] text-center">
        <h3 className="text-[0.72rem] font-bold uppercase tracking-[0.08em] text-[#0D4A6F] leading-snug">
          {client.name}
        </h3>
        {client.nature_of_business && (
          <p className="mt-2 text-[0.68rem] font-semibold leading-snug text-slate-500">
            {client.nature_of_business}
          </p>
        )}
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
            className="font-heading text-3xl sm:text-4xl font-bold text-[#0D4A6F]"
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
