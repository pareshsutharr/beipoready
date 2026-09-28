"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

type LazyYouTubeEmbedProps = {
  videoId: string;
  title: string;
};

export default function LazyYouTubeEmbed({ videoId, title }: LazyYouTubeEmbedProps) {
  const [isActive, setIsActive] = useState(false);
  const thumbnailSrc = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
  const embedSrc = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;

  return (
    <div className="relative aspect-video overflow-hidden rounded border border-slate-200 bg-brand-navy shadow-xl">
      {isActive ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={embedSrc}
          title={title}
          loading="lazy"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsActive(true)}
          className="group absolute inset-0 block h-full w-full text-left"
          aria-label={`Play video: ${title}`}
        >
          <Image
            src={thumbnailSrc}
            alt=""
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-brand-navy/35 to-brand-navy/25" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-brand-navy shadow-lg transition-transform duration-200 group-hover:scale-105">
              <Play className="ml-1 h-7 w-7 fill-current" aria-hidden="true" />
            </span>
            <div>
              <p className="font-heading text-xl font-bold text-white sm:text-2xl">
                {title}
              </p>
              <p className="mt-2 font-sans text-sm text-white/80">
                Click to load the video player
              </p>
            </div>
          </div>
        </button>
      )}
    </div>
  );
}
