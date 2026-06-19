"use client";

import { Play } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { FeaturedWork } from "@/lib/cv-content";

type FeaturedWorkMediaProps = {
  work: FeaturedWork;
  priority?: boolean;
};

export function FeaturedWorkMedia({ work, priority = false }: FeaturedWorkMediaProps) {
  const [playing, setPlaying] = useState(false);

  if (work.video && playing) {
    return (
      <video
        src={work.video}
        poster={work.image}
        controls
        autoPlay
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        if (work.video) setPlaying(true);
      }}
      disabled={!work.video}
      className="interactive group/media relative block h-full w-full text-left disabled:cursor-default"
      aria-label={`${work.brand} — ${work.title}${work.video ? ", reproduzir vídeo" : ""}`}
    >
      <Image
        src={work.image}
        alt={`Projeto ${work.brand} — ${work.title}`}
        fill
        sizes="(max-width: 768px) 85vw, 60vw"
        className="object-cover opacity-90 transition-opacity duration-300 group-hover/media:opacity-100"
        loading={priority ? "eager" : "lazy"}
      />
      {work.video ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-white/20 shadow-[0_0_30px_rgba(0,0,0,0.3)] backdrop-blur-xl transition-all duration-300 group-hover/media:scale-110 group-hover/media:bg-white/30">
            <Play
              className="ml-2 text-white drop-shadow-lg"
              fill="currentColor"
              size={32}
              aria-hidden="true"
            />
          </div>
        </div>
      ) : null}
      <div className="absolute bottom-6 left-6 flex gap-3">
        <span className="rounded-full bg-black/40 px-4 py-1.5 text-[10px] font-bold tracking-widest text-white uppercase backdrop-blur-md">
          Campanha
        </span>
        <span className="rounded-full bg-white/20 px-4 py-1.5 text-[10px] font-bold tracking-widest text-white uppercase backdrop-blur-md">
          {work.tag}
        </span>
      </div>
    </button>
  );
}
