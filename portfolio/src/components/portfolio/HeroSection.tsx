"use client";

import { ChevronDown } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cvContent } from "@/lib/cv-content";
import { siteConfig } from "@/lib/site";

function useViewportHeight() {
  const [height, setHeight] = useState(800);

  useEffect(() => {
    const update = () => {
      setHeight(window.visualViewport?.height ?? window.innerHeight);
    };

    update();
    window.addEventListener("resize", update, { passive: true });
    window.visualViewport?.addEventListener("resize", update, { passive: true });

    return () => {
      window.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("resize", update);
    };
  }, []);

  return height;
}

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [zoomProgress, setZoomProgress] = useState(0);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [idleTilt, setIdleTilt] = useState({ x: 0, y: 0 });
  const [hasEntered, setHasEntered] = useState(false);
  const viewportHeight = useViewportHeight();

  useEffect(() => {
    const enterTimer = window.setTimeout(() => setHasEntered(true), 80);
    return () => window.clearTimeout(enterTimer);
  }, []);

  useEffect(() => {
    setIsTouchDevice(window.matchMedia("(pointer: coarse)").matches);

    const handleScroll = () => {
      if (!sectionRef.current) return;

      const { top, height } = sectionRef.current.getBoundingClientRect();
      const scrollableDistance = height - viewportHeight;

      if (scrollableDistance <= 0) return;

      const scrolled = -top;
      const progress = Math.max(0, Math.min(1, scrolled / scrollableDistance));
      setZoomProgress(progress);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.visualViewport?.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.visualViewport?.removeEventListener("scroll", handleScroll);
    };
  }, [viewportHeight]);

  useEffect(() => {
    if (!isTouchDevice || zoomProgress > 0.05) return;

    let frame = 0;
    const start = performance.now();

    const animate = (now: number) => {
      const t = (now - start) / 1000;
      setIdleTilt({
        x: Math.sin(t * 0.9) * 0.35,
        y: Math.cos(t * 0.7) * 0.25,
      });
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isTouchDevice, zoomProgress]);

  const activeTilt =
    Math.abs(tilt.x) > 0.05 || Math.abs(tilt.y) > 0.05 ? tilt : idleTilt;

  const handlePointerMove = useCallback(
    (clientX: number, clientY: number) => {
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth) * 2 - 1;
      const y = (clientY / innerHeight) * 2 - 1;
      setTilt({ x, y });
    },
    [],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => handlePointerMove(e.clientX, e.clientY),
    [handlePointerMove],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      handlePointerMove(touch.clientX, touch.clientY);
    },
    [handlePointerMove],
  );

  const scaleMultiplier = isTouchDevice ? 80 : 150;
  const textScale = 1 + Math.pow(zoomProgress, 3) * scaleMultiplier;
  const textOpacity = Math.max(0, 1 - Math.pow(zoomProgress, 4));
  const bgOpacity = 1 - Math.pow(zoomProgress, 2);
  const tiltStrength = isTouchDevice ? 8 : 12;

  return (
    <section
      ref={sectionRef}
      className="hero-scroll-track relative w-full bg-[#f5f5f7]"
      style={{ height: `${viewportHeight * 2}px` }}
      aria-label="Apresentação"
    >
      <div className="sr-only">
        <h1>
          {siteConfig.name} — {cvContent.role}
        </h1>
        <h2>
          Portfólio profissional: Netflix, Banco do Brasil, iFood, Mercado Livre
          e W7M Esports
        </h2>
        <p>{cvContent.summary}</p>
      </div>

      <div
        className={`hero-sticky perspective-1000 sticky top-0 flex w-full touch-pan-y items-center justify-center overflow-hidden bg-zinc-950 ${isTouchDevice ? "hero--touch" : ""}`}
        style={{
          height: `${viewportHeight}px`,
          opacity: bgOpacity,
        }}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      >
        <div className="noise-bg pointer-events-none absolute inset-0 z-10 mix-blend-overlay opacity-20" />
        <div className="video-montage-bg absolute inset-0 z-0 opacity-40" />

        <div
          className="hero-zoom-layer zoom-through-o relative z-20 w-full max-w-[92vw]"
          style={{
            transform: `scale(${textScale})`,
            opacity: textOpacity,
          }}
        >
          <div
            className={`hero-tilt-layer flex w-full flex-col items-center justify-center text-center ${hasEntered ? "hero-enter-active" : "hero-enter"}`}
            style={{
              transform: `rotateY(${activeTilt.x * tiltStrength}deg) rotateX(${-activeTilt.y * tiltStrength}deg)`,
            }}
          >
            <p className="hero-subtitle mb-5 max-w-[88vw] text-[9px] leading-relaxed font-bold tracking-[0.22em] text-red-600 uppercase sm:mb-4 sm:max-w-none sm:text-xs sm:tracking-[0.35em] md:text-sm md:tracking-[0.5em]">
              <span className="block sm:inline">Editor de Vídeo</span>
              <span className="mx-2 hidden sm:inline" aria-hidden="true">
                ·
              </span>
              <span className="block sm:inline">eSports & Campanhas</span>
            </p>

            <div
              className="hero-title flex w-full flex-col items-center leading-none font-black tracking-tighter text-white select-none"
              aria-hidden="true"
            >
              <span
                className={`glitch-text block text-[13vw] sm:text-[10vw] ${isTouchDevice ? "glitch-text-auto" : ""}`}
                data-text="MATHEUS"
              >
                MATHEUS
              </span>
              <span
                className={`glitch-text mt-1 block text-[13vw] text-zinc-300 sm:text-[10vw] ${isTouchDevice ? "glitch-text-auto" : ""}`}
                data-text="NASCIMENTO"
              >
                NASCIMENT
                <span className="hero-zoom-o text-red-600">O</span>
              </span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <div
            className="hero-scroll-hint flex flex-col items-center gap-2 text-zinc-500 transition-opacity duration-300"
            style={{ opacity: Math.max(0, 1 - zoomProgress * 5) }}
          >
            <span className="font-mono text-[10px] tracking-widest uppercase">
              {isTouchDevice ? "Deslize para iniciar" : "Scroll to initialize"}
            </span>
            <ChevronDown size={20} aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
