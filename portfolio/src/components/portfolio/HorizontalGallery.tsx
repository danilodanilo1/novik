"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Play } from "lucide-react";
import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { BulletSprite } from "@/components/portfolio/BulletSprite";
import { GamingClipsSection } from "@/components/portfolio/GamingClipsSection";
import {
  applyBulletTear,
  buildTearClipPath,
  hideBulletTear,
} from "@/lib/bullet-tear";
import { cvContent } from "@/lib/cv-content";

gsap.registerPlugin(ScrollTrigger);

const cases = cvContent.featuredWork;
const caseCount = cases.length;
const baseScrollTranslate = ((caseCount - 1) / caseCount) * 100;

function getScrollTranslate(isMobile: boolean) {
  const cardWidthVw = isMobile ? 85 : 60;
  const centerOffset = (100 - cardWidthVw) / 2 / caseCount;
  return baseScrollTranslate + centerOffset;
}

/** Galeria horizontal termina em 26% · rasgo até ~35% */
const GALLERY_PHASE = 0.26;
const TEAR_DURATION = 0.09;
const TEAR_END = GALLERY_PHASE + TEAR_DURATION;

export function HorizontalGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const gamingLayerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const galleryTrackRef = useRef<HTMLDivElement>(null);
  const bgTextRef = useRef<HTMLSpanElement>(null);
  const bulletWrapRef = useRef<HTMLDivElement>(null);
  const fireTrailRef = useRef<HTMLDivElement>(null);
  const fireCoreRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    const gamingLayer = gamingLayerRef.current;
    const overlay = overlayRef.current;
    const galleryTrack = galleryTrackRef.current;
    const bgText = bgTextRef.current;
    const bulletWrap = bulletWrapRef.current;
    const fireTrail = fireTrailRef.current;
    const fireCore = fireCoreRef.current;

    if (
      !section ||
      !pin ||
      !gamingLayer ||
      !overlay ||
      !galleryTrack ||
      !bgText ||
      !bulletWrap ||
      !fireTrail ||
      !fireCore
    ) {
      return;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) {
      gsap.set(overlay, { display: "none" });
      gsap.set([bulletWrap, fireTrail, fireCore], { display: "none" });
      return;
    }

    hideBulletTear(overlay, bulletWrap, fireTrail, fireCore);

    const getGamingScrollMax = () =>
      Math.max(0, gamingLayer.scrollHeight - window.innerHeight);

    const mm = gsap.matchMedia();

    mm.add(
      { isMobile: "(max-width: 768px)", isDesktop: "(min-width: 769px)" },
      (context) => {
        const { isMobile } = context.conditions as { isMobile: boolean };
        const scrollDistance = isMobile ? "+=340%" : "+=420%";

        const st = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: scrollDistance,
          pin: pin,
          scrub: 0.35,
          anticipatePin: 0,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            const gamingScrollMax = getGamingScrollMax();

            const galleryProgress = Math.min(1, p / GALLERY_PHASE);

            const scrollTranslate = getScrollTranslate(isMobile);

            gsap.set(galleryTrack, {
              x: `${-galleryProgress * scrollTranslate}%`,
              force3D: true,
            });
            gsap.set(bgText, {
              x: `${-galleryProgress * 50}%`,
              force3D: true,
            });

            if (p >= TEAR_END) {
              hideBulletTear(
                overlay,
                bulletWrap,
                fireTrail,
                fireCore,
                true,
              );

              const clipsProgress = (p - TEAR_END) / (1 - TEAR_END);
              gsap.set(gamingLayer, {
                y: -clipsProgress * gamingScrollMax,
                force3D: true,
              });
            } else {
              const tearStart = isMobile ? GALLERY_PHASE : GALLERY_PHASE * 0.86;

              if (p >= tearStart) {
                const tearProgress = Math.min(
                  1,
                  (p - tearStart) / (TEAR_END - tearStart),
                );
                applyBulletTear(
                  tearProgress,
                  overlay,
                  bulletWrap,
                  fireTrail,
                  fireCore,
                );
                gsap.set(gamingLayer, { y: 0, force3D: true });
              } else {
                hideBulletTear(overlay, bulletWrap, fireTrail, fireCore);
                gsap.set(gamingLayer, { y: 0, force3D: true });
              }
            }
          },
        });

        return () => st.kill();
      },
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="marcas-projetos"
      className="relative z-20 bg-[#f5f5f7]"
      aria-label="Marcas, projetos e highlights eSports"
    >
      <div
        ref={pinRef}
        className="relative h-[100dvh] min-h-screen w-full touch-pan-y overflow-hidden bg-[#050505]"
      >
        {/* Gaming clips ÔÇö sempre por baixo, revelado pelo rasgo */}
        <div
          ref={gamingLayerRef}
          className="absolute top-0 left-0 z-0 w-full will-change-transform"
        >
          <GamingClipsSection embedded />
        </div>

        {/* Overlay claro com galeria horizontal ÔÇö rasgado pela bala */}
        <div
          ref={overlayRef}
          className="absolute inset-0 z-20 overflow-hidden bg-[#f5f5f7] will-change-[clip-path]"
          style={{ clipPath: buildTearClipPath(108) }}
        >
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden opacity-[0.03]">
            <span
              ref={bgTextRef}
              className="text-[30vw] font-bold whitespace-nowrap text-black"
              style={{ fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif" }}
              aria-hidden="true"
            >
              PROJETOS
            </span>
          </div>

          <div
            ref={galleryTrackRef}
            className="flex h-full items-center gap-16 pl-[7.5vw] pr-[7.5vw] md:gap-20 md:px-[10vw]"
            style={{
              width: `${caseCount * 100}vw`,
              willChange: "transform",
            }}
          >
            {cases.map((work, idx) => (
              <article
                key={work.brand}
                className="interactive group flex h-[80vh] w-[85vw] shrink-0 flex-col items-center gap-10 md:w-[60vw] md:flex-row md:gap-12"
              >
                <div className="relative h-[40vh] w-full overflow-hidden rounded-3xl bg-black shadow-2xl md:h-[70%] md:w-[60%]">
                  <Image
                    src={work.image}
                    alt={`Projeto ${work.brand} ÔÇö ${work.title}`}
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
            ))}
          </div>
        </div>

        {/* Bala + fogo ÔÇö s├│ vis├¡vel na fase de rasgo */}
        <div
          ref={fireTrailRef}
          className="bullet-fire-trail pointer-events-none absolute top-1/2 z-30 h-10 -translate-y-1/2 sm:h-14"
          style={{ left: "108vw", width: 0, opacity: 0 }}
        />
        <div
          ref={bulletWrapRef}
          className="pointer-events-none absolute top-1/2 z-40 h-0 w-0 -translate-y-1/2 will-change-transform"
          style={{ left: "108vw" }}
        >
          <div
            ref={fireCoreRef}
            className="bullet-fire-core absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
            aria-hidden="true"
          />
          <BulletSprite
            direction="left"
            className="absolute top-1/2 left-0 h-16 w-60 -translate-y-1/2 sm:h-20 sm:w-72 md:h-24 md:w-[22rem]"
          />
        </div>
      </div>
    </section>
  );
}
