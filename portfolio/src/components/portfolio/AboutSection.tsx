import { CvDownloadGroup } from "@/components/cv/CvDownloadGroup";
import { cvContent } from "@/lib/cv-content";

export function AboutSection() {
  return (
    <section
      className="relative z-20 bg-[#f5f5f7] px-6 py-24 md:px-20"
      aria-labelledby="about-heading"
    >
      <div className="mx-auto max-w-7xl">
        <p className="mb-4 font-mono text-xs tracking-[0.4em] text-red-600 uppercase">
          Sobre
        </p>
        <h2
          id="about-heading"
          className="mb-8 max-w-4xl text-4xl font-black tracking-tighter text-black md:text-6xl"
        >
          Referência em eSports. Versatilidade em campanhas de grande porte.
        </h2>
        <p className="max-w-3xl text-lg leading-relaxed text-zinc-600 md:text-xl">
          {cvContent.summary}
        </p>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-zinc-500 md:text-xl">
          {cvContent.tagline}
        </p>

        <div className="mt-12 flex flex-wrap gap-3">
          {[
            "2,1M+ inscritos · Receitas Aprenda",
            "W7M · 60K+ inscritos",
            "Netflix · BB · iFood · Mercado Livre",
            "IA & 5 idiomas",
          ].map((badge) => (
            <span
              key={badge}
              className="rounded-full border border-zinc-300 bg-white px-5 py-2 text-[11px] font-bold tracking-widest text-zinc-700 uppercase"
            >
              {badge}
            </span>
          ))}
        </div>

        <div className="mt-10">
          <CvDownloadGroup surface="light" />
        </div>
      </div>
    </section>
  );
}
