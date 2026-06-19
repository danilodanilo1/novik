"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { BulletSprite } from "@/components/portfolio/BulletSprite";
import { FeaturedWorkMedia } from "@/components/portfolio/FeaturedWorkMedia";
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

/** Scroll budget por fase — proporcional ao conteúdo real */
function computeScrollPhases(
  isMobile: boolean,
  gamingScrollMax: number,
  viewportH: number,
) {
  const galleryPx = viewportH * (isMobile ? 2.6 : 3.2);
  const tearPx = viewportH * (isMobile ? 0.5 : 0.6);
  const gamingPx = Math.max(
    gamingScrollMax,
    viewportH * (isMobile ? 2.0 : 2.4),
  );
  const totalPx = galleryPx + tearPx + gamingPx;

  return {
    scrollEndPx: totalPx,
    galleryEnd: galleryPx / totalPx,
    tearEnd: (galleryPx + tearPx) / totalPx,
  };
}

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

  useEffect(() => {
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

    const getPinHeight = () => pin.offsetHeight;
    const getGamingScrollMax = () =>
      Math.max(0, gamingLayer.scrollHeight - getPinHeight());

    let gamingScrollMax = getGamingScrollMax();

    const setGalleryX = gsap.quickSetter(galleryTrack, "x", "%");
    const setBgTextX = gsap.quickSetter(bgText, "x", "%");
    const setGamingY = gsap.quickSetter(gamingLayer, "y", "px");

    const refreshMetrics = () => {
      const next = getGamingScrollMax();
      const changed = Math.abs(next - gamingScrollMax) > 8;
      gamingScrollMax = next;
      if (changed) ScrollTrigger.refresh();
    };

    window.addEventListener("load", refreshMetrics);

    const resizeObserver = new ResizeObserver(refreshMetrics);
    resizeObserver.observe(gamingLayer);

    const mm = gsap.matchMedia();

    mm.add(
      { isMobile: "(max-width: 768px)", isDesktop: "(min-width: 769px)" },
      (context) => {
        const { isMobile } = context.conditions as { isMobile: boolean };
        const scrollTranslate = getScrollTranslate(isMobile);

        const st = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: () => {
            refreshMetrics();
            const phases = computeScrollPhases(
              isMobile,
              gamingScrollMax,
              getPinHeight(),
            );
            return `+=${Math.round(phases.scrollEndPx)}`;
          },
          pin: pin,
          scrub: true,
          anticipatePin: 1,
          fastScrollEnd: true,
          invalidateOnRefresh: true,
          onRefresh: refreshMetrics,
          onUpdate: (self) => {
            const pinHeight = getPinHeight();
            const phases = computeScrollPhases(
              isMobile,
              gamingScrollMax,
              pinHeight,
            );
            const p = self.progress;

            if (p <= phases.galleryEnd) {
              const galleryProgress = p / phases.galleryEnd;
              setGalleryX(-galleryProgress * scrollTranslate);
              setBgTextX(-galleryProgress * 50);
              hideBulletTear(overlay, bulletWrap, fireTrail, fireCore);
              setGamingY(0);
              return;
            }

            if (p <= phases.tearEnd) {
              setGalleryX(-scrollTranslate);
              setBgTextX(-50);

              const tearSpan = phases.tearEnd - phases.galleryEnd;
              const tearProgress = Math.min(
                1,
                (p - phases.galleryEnd) / tearSpan,
              );
              applyBulletTear(
                tearProgress,
                overlay,
                bulletWrap,
                fireTrail,
                fireCore,
              );
              setGamingY(0);
              return;
            }

            hideBulletTear(overlay, bulletWrap, fireTrail, fireCore, true);

            const clipsSpan = 1 - phases.tearEnd;
            const clipsProgress = Math.min(
              1,
              (p - phases.tearEnd) / clipsSpan,
            );
            setGamingY(-clipsProgress * gamingScrollMax);
          },
        });

        return () => st.kill();
      },
    );

    return () => {
      window.removeEventListener("load", refreshMetrics);
      resizeObserver.disconnect();
      mm.revert();
    };
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
        className="relative h-[100svh] w-full touch-pan-y overflow-hidden bg-[#050505]"
      >
        {/* Gaming clips — sempre por baixo, revelado pelo rasgo */}
        <div
          ref={gamingLayerRef}
          className="absolute top-0 left-0 z-0 w-full will-change-transform"
        >
          <GamingClipsSection embedded />
        </div>

        {/* Overlay claro com galeria horizontal — rasgado pela bala */}
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
                key={work.video}
                className="interactive group flex h-[80vh] w-[85vw] shrink-0 flex-col items-center gap-10 md:w-[60vw] md:flex-row md:gap-12"
              >
                <div className="relative h-[40vh] w-full overflow-hidden rounded-3xl bg-black shadow-2xl md:h-[70%] md:w-[60%]">
                  <FeaturedWorkMedia work={work} priority={idx === 0} />
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

        {/* Bala + fogo — só visível na fase de rasgo */}
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