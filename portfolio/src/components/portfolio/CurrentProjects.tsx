"use client";

import { Cpu, FastForward, MonitorPlay } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CvDownloadGroup } from "@/components/cv/CvDownloadGroup";
import { cvContent } from "@/lib/cv-content";

export function CurrentProjects() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const currentJob = cvContent.experience[0];

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        const { top } = entry.boundingClientRect;
        const windowHeight = window.innerHeight;

        if (entry.isIntersecting && top < windowHeight * 0.6 && top > 0) {
          setIsFlashing(Math.floor(top) % 60 < 10);
        } else {
          setIsFlashing(false);
        }
      },
      { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6] },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`relative z-10 w-full px-6 py-32 transition-colors duration-75 md:px-20 ${isFlashing ? "bg-zinc-900" : "bg-[#050505]"}`}
      aria-label="Projeto atual e diferenciais"
    >
      <div className="absolute top-10 right-10 flex animate-pulse items-center gap-2 font-mono text-[10px] tracking-widest text-zinc-500">
        <div className="h-2 w-2 rounded-full bg-red-600" aria-hidden="true" />
        PROJETO ATUAL · {currentJob.period}
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="mb-20 flex flex-col items-end justify-between border-b border-zinc-800 pb-10 md:flex-row">
          <div>
            <h2 className="text-5xl font-black tracking-tighter text-white md:text-7xl">
              DIFERENCIAIS
            </h2>
            <p className="mt-4 text-lg text-zinc-400">
              Edição rítmica, inteligência artificial aplicada e escala multilíngue.
            </p>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row md:mt-0">
            <a
              href="#contact"
              className="interactive flex items-center justify-center gap-2 bg-white px-8 py-4 text-sm font-bold tracking-widest text-black uppercase transition-colors duration-300 hover:bg-red-600 hover:text-white"
            >
              Contratar Freelancer/CLT/PJ <FastForward size={16} aria-hidden="true" />
            </a>
            <CvDownloadGroup />
          </div>
        </div>

        <div className="perspective-1000 grid grid-cols-1 gap-8 md:grid-cols-2">
          <article className="interactive group border border-zinc-800 bg-zinc-900/40 p-10 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-red-500/50 hover:shadow-[0_0_40px_rgba(220,38,38,0.15)]">
            <Cpu
              className="mb-6 text-red-500 transition-transform duration-300 group-hover:scale-125"
              size={40}
              aria-hidden="true"
            />
            <h3 className="mb-2 text-3xl font-bold text-white">
              {currentJob.company}
            </h3>
            <p className="mb-6 font-mono text-xs tracking-widest text-red-400 uppercase">
              {currentJob.role} · {currentJob.period}
            </p>
            <p className="mb-8 text-lg leading-relaxed text-zinc-400">
              {currentJob.description}
            </p>
            <div className="flex flex-wrap gap-3">
              {currentJob.tools.map((tool) => (
                <span
                  key={tool}
                  className={`rounded-full px-4 py-2 text-[10px] font-bold tracking-widest uppercase ${
                    tool.includes("ElevenLabs") || tool.includes("Inteligência Artificial")
                      ? "border border-red-900/50 bg-black text-red-400"
                      : "bg-black text-zinc-300"
                  }`}
                >
                  {tool}
                </span>
              ))}
            </div>
          </article>

          <article className="interactive group border border-zinc-800 bg-zinc-900/40 p-10 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-zinc-500 hover:shadow-[0_0_40px_rgba(255,255,255,0.05)]">
            <MonitorPlay
              className="mb-6 text-zinc-300 transition-transform duration-300 group-hover:scale-125"
              size={40}
              aria-hidden="true"
            />
            <h3 className="mb-4 text-3xl font-bold text-white">
              Legado W7M Esports
            </h3>
            <p className="mb-8 text-lg leading-relaxed text-zinc-400">
              {cvContent.experience[1].description}
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              {cvContent.experience[1].highlights.map((item, i) => {
                const colors = [
                  "bg-red-500",
                  "bg-blue-500",
                  "bg-purple-500",
                ];
                return (
                  <div key={item} className="flex items-center gap-3">
                    <div
                      className={`h-2 w-2 animate-pulse rounded-full ${colors[i % colors.length]}`}
                      aria-hidden="true"
                    />
                    <span className="text-sm font-bold tracking-wider text-zinc-300">
                      {item}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {cvContent.experience[1].tools.map((tool) => (
                <span
                  key={tool}
                  className="rounded-full bg-black px-3 py-1.5 text-[10px] font-bold tracking-widest text-zinc-400 uppercase"
                >
                  {tool}
                </span>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
