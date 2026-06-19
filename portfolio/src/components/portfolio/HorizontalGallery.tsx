"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { BulletSprite } from "@/components/portfolio/BulletSprite";
import { FeaturedWorkMedia } from "@/components/portfolio/FeaturedWorkMedia";
import { GamingClipsSection } from "@/components/portfolio/GamingClipsSection";
import {
  applyTearAnimation,
  buildTearClipPath,
  BULLET_GONE,
  finishTearOpen,
  hideBulletTear,
} from "@/lib/bullet-tear";
import { cvContent } from "@/lib/cv-content";

gsap.registerPlugin(ScrollTrigger);

const cases = cvContent.featuredWork;
const caseCount = cases.length;

type GalleryBounds = {
  startX: number;
  endX: number;
};

function measureGalleryBounds(
  galleryTrack: HTMLElement,
  pin: HTMLElement,
): GalleryBounds {
  const articles = galleryTrack.querySelectorAll("article");
  const first = articles[0];
  const last = articles[articles.length - 1];

  if (!first || !last) {
    return { startX: 0, endX: 0 };
  }

  const pinCenter = pin.offsetWidth / 2;
  const firstCenter = first.offsetLeft + first.offsetWidth / 2;
  const lastCenter = last.offsetLeft + last.offsetWidth / 2;

  return {
    startX: pinCenter - firstCenter,
    endX: pinCenter - lastCenter,
  };
}

/** Scroll budget por fase — proporcional ao conteúdo real */
function computeScrollPhases(
  isMobile: boolean,
  gamingScrollMax: number,
  viewportH: number,
) {
  const galleryPx = viewportH * (isMobile ? 2.6 : 3.2);
  const tearTravelPx = viewportH * (isMobile ? 0.55 : 0.65);
  const tearWidenPx = viewportH * (isMobile ? 1.15 : 1.45);
  const tearPx = tearTravelPx + tearWidenPx;
  const gamingPx = Math.max(
    gamingScrollMax,
    viewportH * (isMobile ? 2.0 : 2.4),
  );
  const totalPx = galleryPx + tearPx + gamingPx;

  return {
    scrollEndPx: totalPx,
    galleryEnd: galleryPx / totalPx,
    tearTravelEnd: (galleryPx + tearTravelPx) / totalPx,
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
    let galleryBounds = measureGalleryBounds(galleryTrack, pin);

    const setGalleryX = gsap.quickSetter(galleryTrack, "x", "px");
    const setBgTextX = gsap.quickSetter(bgText, "x", "%");
    const setGamingY = gsap.quickSetter(gamingLayer, "y", "px");

    const syncGalleryBounds = () => {
      galleryBounds = measureGalleryBounds(galleryTrack, pin);
      setGalleryX(galleryBounds.startX);
    };

    let refreshRaf = 0;
    const schedulePinRefresh = () => {
      cancelAnimationFrame(refreshRaf);
      refreshRaf = requestAnimationFrame(() => {
        gamingScrollMax = getGamingScrollMax();
        syncGalleryBounds();
        ScrollTrigger.refresh();
      });
    };

    const refreshGamingScrollMax = () => {
      const next = getGamingScrollMax();
      if (Math.abs(next - gamingScrollMax) > 8) {
        gamingScrollMax = next;
        schedulePinRefresh();
      }
    };

    syncGalleryBounds();
    window.addEventListener("load", schedulePinRefresh);

    const resizeObserver = new ResizeObserver(refreshGamingScrollMax);
    resizeObserver.observe(gamingLayer);

    const onViewportResize = () => schedulePinRefresh();
    window.addEventListener("resize", onViewportResize);

    const mm = gsap.matchMedia();

    mm.add(
      { isMobile: "(max-width: 768px)", isDesktop: "(min-width: 769px)" },
      (context) => {
        const { isMobile } = context.conditions as { isMobile: boolean };

        const st = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: () => {
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
          onRefresh: () => {
            gamingScrollMax = getGamingScrollMax();
          },
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
              const { startX, endX } = galleryBounds;
              setGalleryX(startX + galleryProgress * (endX - startX));
              setBgTextX(-galleryProgress * 50);
              hideBulletTear(overlay, bulletWrap, fireTrail, fireCore);
              setGamingY(0);
              return;
            }

            if (p <= phases.tearEnd) {
              const { endX } = galleryBounds;
              setGalleryX(endX);
              setBgTextX(-50);

              let tearProgress: number;
              if (p <= phases.tearTravelEnd) {
                const travelSpan = phases.tearTravelEnd - phases.galleryEnd;
                const travelU = (p - phases.galleryEnd) / travelSpan;
                tearProgress = travelU * BULLET_GONE;
              } else {
                const widenSpan = phases.tearEnd - phases.tearTravelEnd;
                const widenU = (p - phases.tearTravelEnd) / widenSpan;
                tearProgress = BULLET_GONE + widenU * (1 - BULLET_GONE);
              }

              applyTearAnimation(
                tearProgress,
                overlay,
                bulletWrap,
                fireTrail,
                fireCore,
              );
              setGamingY(0);
              return;
            }

            finishTearOpen(overlay, bulletWrap, fireTrail, fireCore);

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
      cancelAnimationFrame(refreshRaf);
      window.removeEventListener("load", schedulePinRefresh);
      window.removeEventListener("resize", onViewportResize);
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

        {/* Bala + fogo — acima do overlay rasgado */}
        <div
          ref={fireTrailRef}
          className="bullet-fire-trail pointer-events-none absolute top-1/2 z-[45] h-10 -translate-y-1/2 sm:h-14"
          style={{ left: "108vw", width: 0, opacity: 0 }}
        />
        <div
          ref={bulletWrapRef}
          className="pointer-events-none absolute top-1/2 z-50 h-0 w-0 -translate-y-1/2 will-change-transform"
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