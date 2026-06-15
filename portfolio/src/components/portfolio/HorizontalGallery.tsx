"use client";

import { Play } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cvContent } from "@/lib/cv-content";

const cases = cvContent.featuredWork;
const caseCount = cases.length;
const scrollTranslate = ((caseCount - 1) / caseCount) * 100;

export function HorizontalGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const { top, height } = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const scrollableDistance = height - windowHeight;
      const scrolled = -top;

      let progress = scrolled / scrollableDistance;
      progress = Math.max(0, Math.min(1, progress));

      setScrollProgress(progress);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative z-20 h-[350vh] bg-[#f5f5f7] shadow-[0_-30px_50px_rgba(245,245,247,1)]"
      aria-label="Marcas e projetos selecionados"
    >
      <div className="sticky top-0 flex h-screen w-full items-center overflow-hidden bg-[#f5f5f7]">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden opacity-[0.03]">
          <span
            className="transform text-[30vw] font-bold whitespace-nowrap text-black"
            style={{
              transform: `translateX(${-scrollProgress * 50}%)`,
              fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
            }}
            aria-hidden="true"
          >
            MARCAS & PROJETOS
          </span>
        </div>

        <div
          className="flex h-[80vh] items-center gap-16 px-[8vw] transition-transform duration-75 ease-out md:gap-20 md:px-[10vw]"
          style={{
            transform: `translateX(${-scrollProgress * scrollTranslate}%)`,
            width: `${caseCount * 100}vw`,
          }}
        >
          {cases.map((work, idx) => {
            const itemPosition = idx / (caseCount - 1);
            const distance = Math.abs(scrollProgress - itemPosition);
            const isActive = distance < 0.15;

            return (
              <article
                key={work.brand}
                className={`interactive group flex h-full w-[85vw] shrink-0 flex-col items-center gap-10 transition-opacity duration-500 md:w-[60vw] md:flex-row md:gap-12 ${isActive ? "opacity-100" : "opacity-30"}`}
              >
                <div
                  className={`relative h-[40vh] w-full overflow-hidden rounded-3xl bg-black shadow-2xl transition-transform duration-700 md:h-[70%] md:w-[60%] ${isActive ? "scale-100" : "scale-95"}`}
                >
                  <Image
                    src={work.image}
                    alt={`Projeto ${work.brand} — ${work.title}`}
                    fill
                    sizes="(max-width: 768px) 85vw, 60vw"
                    className="object-cover opacity-60 mix-blend-luminosity"
                    loading={idx === 0 ? "eager" : "lazy"}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-white/20 shadow-[0_0_30px_rgba(0,0,0,0.3)] backdrop-blur-xl transition-all duration-300 group-hover:scale-110 group-hover:bg-white/30">
                      <Play
                        className="ml-2 text-white drop-shadow-lg"
                        fill="currentColor"
                        size={32}
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                  <div className="absolute bottom-6 left-6 flex gap-3">
                    <span className="rounded-full bg-black/40 px-4 py-1.5 text-[10px] font-bold tracking-widest text-white uppercase backdrop-blur-md">
                      Campanha
                    </span>
                    <span className="rounded-full bg-white/20 px-4 py-1.5 text-[10px] font-bold tracking-widest text-white uppercase backdrop-blur-md">
                      {work.tag}
                    </span>
                  </div>
                </div>

                <div className="flex w-full flex-col justify-center text-black md:w-[40%]">
                  <span
                    className={`mb-4 text-sm font-black tracking-widest uppercase drop-shadow-sm ${work.accent}`}
                  >
                    {work.brand}
                  </span>
                  <h2
                    className="mb-6 text-4xl leading-none font-black tracking-tighter md:text-6xl"
                    style={{
                      fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                    }}
                  >
                    {work.title}
                  </h2>
                  <p className="text-base leading-relaxed font-medium text-zinc-600 md:text-lg">
                    {work.desc}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
