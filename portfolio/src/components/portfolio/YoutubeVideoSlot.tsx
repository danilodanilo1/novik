"use client";

import { Play } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { GamingClip } from "@/lib/cv-content";
import { siteConfig } from "@/lib/site";

type YoutubeVideoSlotProps = {
  clip: GamingClip;
};

export function YoutubeVideoSlot({ clip }: YoutubeVideoSlotProps) {
  const [playing, setPlaying] = useState(false);

  if (!clip.videoId && !clip.src) {
    return null;
  }

  const watchUrl = clip.videoId
    ? `https://www.youtube.com/watch?v=${clip.videoId}`
    : null;
  const embedUrl = clip.videoId
    ? `https://www.youtube-nocookie.com/embed/${clip.videoId}?rel=0&modestbranding=1&autoplay=1&origin=${encodeURIComponent(siteConfig.url)}`
    : null;

  if (clip.src && playing) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
        <video
          src={clip.src}
          poster={clip.image}
          controls
          autoPlay
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    );
  }

  if (!playing) {
    return (
      <button
        type="button"
        onClick={() => setPlaying(true)}
        className="interactive group/video relative block aspect-video w-full overflow-hidden rounded-xl bg-black text-left"
        aria-label={`${clip.title} — reproduzir vídeo`}
      >
        <Image
          src={clip.image}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover opacity-80 transition-opacity duration-300 group-hover/video:opacity-95"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/25 bg-black/40 backdrop-blur-sm transition-transform duration-300 group-hover/video:scale-110">
            <Play
              className="ml-1 text-white"
              fill="currentColor"
              size={24}
              aria-hidden="true"
            />
          </div>
          <span className="font-mono text-[10px] tracking-widest text-zinc-300 uppercase">
            Assistir
          </span>
        </div>
        <span className="absolute top-3 left-3 rounded-full bg-red-600 px-3 py-1 text-[10px] font-bold tracking-widest text-white uppercase">
          {clip.tag}
        </span>
        <span className="absolute top-3 right-3 font-mono text-xs text-zinc-200">
          {clip.duration}
        </span>
      </button>
    );
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
      {embedUrl ? (
        <iframe
          src={embedUrl}
          title={clip.title}
          className="absolute inset-0 h-full w-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : null}
      {watchUrl ? (
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute right-3 bottom-3 rounded-full bg-black/60 px-3 py-1 text-[10px] font-bold tracking-widest text-zinc-300 uppercase backdrop-blur-sm transition-colors hover:text-white"
        >
          YouTube
        </a>
      ) : null}
    </div>
  );
}
