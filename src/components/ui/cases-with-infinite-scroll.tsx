"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import type { ClientLogoCard } from "@/lib/cms";

const FALLBACK_CLIENTS: ClientLogoCard[] = [
  { name: "Reliance", logo_url: "/svgs/RELIANCE.NS.svg", website_url: null },
  { name: "Infosys", logo_url: "/svgs/INFY.svg", website_url: null },
  { name: "Titan", logo_url: "/svgs/TITAN.NS.svg", website_url: null },
  { name: "TCS", logo_url: "/svgs/TCS.NS.svg", website_url: null },
  { name: "State Bank", logo_url: "/svgs/SBIN.NS.svg", website_url: null },
  { name: "Bharti Airtel", logo_url: "/svgs/BHARTIARTL.NS.svg", website_url: null },
];

const CLIENT_SUMMARIES = [
  "IPO readiness review",
  "Governance upgrade",
  "Capital market planning",
  "Investor story support",
  "Listing roadmap advisory",
  "Compliance preparation",
];

function getClientSummary(name: string) {
  const seed = Array.from(name).reduce((total, char) => total + char.charCodeAt(0), 0);
  return CLIENT_SUMMARIES[seed % CLIENT_SUMMARIES.length];
}

function ClientLogoTile({ client }: { client: ClientLogoCard }) {
  const summary = getClientSummary(client.name);

  const tile = (
    <div className="flex h-[270px] w-full flex-col items-center rounded-[30px] bg-[#FFFDF6] px-8 pb-9 pt-8 shadow-[0_3px_18px_rgba(15,45,82,0.15)] ring-1 ring-[#F1EBDD]" >
      <div className="flex h-[126px] w-[126px] items-center justify-center rounded-full bg-[#FFFDF6] p-3 shadow-[0_7px_16px_rgba(15,45,82,0.14),inset_0_1px_1px_rgba(255,255,255,0.95)] ring-1 ring-[#F1EBDD]">
        <div className="flex h-[104px] w-[104px] items-center justify-center rounded-full bg-white p-4 shadow-[inset_0_0_0_1px_rgba(15,45,82,0.03)]">
          <img
            src={client.logo_url}
            alt={`${client.name} logo`}
            className="max-h-[76px] max-w-[84px] object-contain"
          />
        </div>
      </div>

      <div className="mt-[28px] max-w-[132px] text-center">
        <h3 className="truncate text-[0.72rem] font-bold uppercase tracking-[0.08em] text-[#0D4A6F]">
          {client.name}
        </h3>
        <p className="mt-2 text-[0.68rem] leading-[1.35] text-slate-500">
          {summary}
        </p>
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
      className="relative flex h-[90vh] w-full items-center overflow-hidden bg-[#FEFBF2]"
      aria-labelledby="clients-heading"
    >
      <div className="mx-auto w-full max-w-[1040px] px-6 md:px-10 lg:px-12">
        <div className="mb-[94px]">
          <div className="flex items-center gap-2">
            <h2
              id="clients-heading"
              className="font-sans text-[1.75rem] font-normal leading-[0.88] text-[#0D4A6F]"
            >
              Our
            </h2>
            <span className="mt-1 h-px w-[52px] bg-[#0D4A6F]" />
            <span className="mt-1 h-1 w-1 rounded-full bg-[#ECB85B]" />
          </div>
          <p className="-mt-1 font-sans text-[2.28rem] font-bold leading-none text-[#ECB85B]">
            Clients
          </p>
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
