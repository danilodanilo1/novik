"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cvContent } from "@/lib/cv-content";
import { siteConfig } from "@/lib/site";

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const zoomLayerRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const tiltLayerRef = useRef<HTMLDivElement>(null);
  const zoomProgressRef = useRef(0);

  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [idleTilt, setIdleTilt] = useState({ x: 0, y: 0 });
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const enterTimer = window.setTimeout(() => setHasEntered(true), 80);
    return () => window.clearTimeout(enterTimer);
  }, []);

  useEffect(() => {
    setIsTouchDevice(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const stickyEl = stickyRef.current;
    const zoomLayer = zoomLayerRef.current;
    const hintEl = hintRef.current;

    if (!section || !stickyEl || !zoomLayer || !hintEl) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) return;

    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const scaleMultiplier = isTouch ? 80 : 150;

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom top",
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const p = self.progress;
        zoomProgressRef.current = p;

        const textScale = 1 + Math.pow(p, 3) * scaleMultiplier;
        const textOpacity = Math.max(0, 1 - Math.pow(p, 4));
        const bgOpacity = 1 - Math.pow(p, 2);

        gsap.set(zoomLayer, {
          scale: textScale,
          opacity: textOpacity,
          force3D: true,
        });
        gsap.set(stickyEl, { opacity: bgOpacity });
        gsap.set(hintEl, { opacity: Math.max(0, 1 - p * 5) });
      },
    });

    return () => st.kill();
  }, []);

  useEffect(() => {
    if (!isTouchDevice) return;

    let frame = 0;
    const start = performance.now();

    const animate = (now: number) => {
      if (zoomProgressRef.current > 0.05) {
        frame = requestAnimationFrame(animate);
        return;
      }

      const t = (now - start) / 1000;
      setIdleTilt({
        x: Math.sin(t * 0.9) * 0.35,
        y: Math.cos(t * 0.7) * 0.25,
      });
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isTouchDevice]);

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

  const tiltStrength = isTouchDevice ? 8 : 12;

  return (
    <section
      ref={sectionRef}
      className="hero-scroll-track relative min-h-[200svh] w-full bg-[#f5f5f7]"
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
        ref={stickyRef}
        className={`hero-sticky perspective-1000 sticky top-0 flex h-[100svh] w-full touch-pan-y items-center justify-center overflow-hidden bg-zinc-950 ${isTouchDevice ? "hero--touch" : ""}`}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      >
        <div className="noise-bg pointer-events-none absolute inset-0 z-10 mix-blend-overlay opacity-20" />
        <div className="video-montage-bg absolute inset-0 z-0 opacity-40" />

        <div
          ref={zoomLayerRef}
          className="hero-zoom-layer zoom-through-o relative z-20 w-full max-w-[92vw]"
        >
          <div
            ref={tiltLayerRef}
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
            ref={hintRef}
            className="hero-scroll-hint flex flex-col items-center gap-2 text-zinc-500"
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
