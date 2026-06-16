import { ExternalLink, Video } from "lucide-react";
import { cvContent } from "@/lib/cv-content";
import { YoutubeVideoSlot } from "@/components/portfolio/YoutubeVideoSlot";

type GamingClipsSectionProps = {
  embedded?: boolean;
};

export function GamingClipsSection({ embedded = false }: GamingClipsSectionProps) {
  const { gamingChannel } = cvContent;
  const Tag = embedded ? "div" : "section";

  return (
    <Tag
      id={embedded ? undefined : "gaming-clips"}
      className={
        embedded
          ? "w-full bg-[#050505] px-4 py-12 sm:px-8 md:px-16"
          : "relative bg-[#050505] px-4 py-16 sm:px-8 sm:py-24 md:px-16"
      }
      aria-labelledby="gaming-clips-heading"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-4 font-mono text-xs tracking-[0.4em] text-red-600 uppercase">
              {gamingChannel.name} · YouTube Highlights
            </p>
            <h2
              id="gaming-clips-heading"
              className="mb-4 text-4xl font-black tracking-tighter text-white md:text-6xl"
            >
              FRAGS & HIGHLIGHTS
            </h2>
            <p className="max-w-2xl text-base text-zinc-400 md:text-lg">
              Fragmovies, highlights e cortes competitivos em formato horizontal —
              o ritmo que definiu anos de conteúdo no YouTube. Canal{" "}
              <span className="text-zinc-300">{gamingChannel.handle}</span>.
            </p>
          </div>
          <a
            href={gamingChannel.url}
            target="_blank"
            rel="noopener noreferrer"
            className="interactive inline-flex shrink-0 items-center gap-2 border border-zinc-700 bg-zinc-900/80 px-5 py-3 text-xs font-bold tracking-widest text-white uppercase transition-colors hover:border-red-500/50 hover:bg-zinc-800"
          >
            <Video size={18} className="text-red-500" aria-hidden="true" />
            Ver canal
            <ExternalLink size={14} className="text-zinc-500" aria-hidden="true" />
          </a>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cvContent.gamingClips.map((clip) => (
            <article
              key={clip.videoId}
              className="interactive group overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 transition-colors hover:border-red-500/40"
            >
              <YoutubeVideoSlot clip={clip} />
              <div className="p-5">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <h3 className="text-lg font-bold text-white">{clip.title}</h3>
                  <span className="shrink-0 font-mono text-[10px] tracking-wide text-zinc-500 uppercase">
                    {clip.views} views
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-zinc-500">{clip.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </Tag>
  );
}
