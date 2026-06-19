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
  const bgRef = useRef<HTMLDivElement>(null);
  const zoomLayerRef = useRef<HTMLDivElement>(null);
  const zoomTargetRef = useRef<HTMLSpanElement>(null);
  const whiteBackdropRef = useRef<HTMLDivElement>(null);
  const whiteCoverRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const tiltLayerRef = useRef<HTMLDivElement>(null);
  const zoomProgressRef = useRef(0);
  const tiltRef = useRef({ x: 0, y: 0 });
  const tiltRafRef = useRef(0);
  const isTouchRef = useRef(false);

  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const enterTimer = window.setTimeout(() => setHasEntered(true), 80);
    return () => window.clearTimeout(enterTimer);
  }, []);

  const applyTilt = useCallback(() => {
    const el = tiltLayerRef.current;
    if (!el) return;

    const { x, y } = tiltRef.current;
    const strength = isTouchRef.current ? 8 : 12;
    el.style.transform = `rotateY(${x * strength}deg) rotateX(${-y * strength}deg)`;
  }, []);

  useEffect(() => {
    const touch = window.matchMedia("(pointer: coarse)").matches;
    isTouchRef.current = touch;
    setIsTouchDevice(touch);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const stickyEl = stickyRef.current;
    const bgEl = bgRef.current;
    const zoomLayer = zoomLayerRef.current;
    const zoomTarget = zoomTargetRef.current;
    const whiteBackdropEl = whiteBackdropRef.current;
    const whiteCoverEl = whiteCoverRef.current;
    const hintEl = hintRef.current;

    if (
      !section ||
      !stickyEl ||
      !bgEl ||
      !zoomLayer ||
      !zoomTarget ||
      !whiteBackdropEl ||
      !whiteCoverEl ||
      !hintEl
    ) {
      return;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) return;

    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const scaleMultiplier = isTouch ? 80 : 150;

    const updateZoomOrigin = () => {
      const targetRect = zoomTarget.getBoundingClientRect();
      const layerRect = zoomLayer.getBoundingClientRect();

      if (!targetRect.width || !layerRect.width) return;

      const originX = targetRect.left + targetRect.width / 2 - layerRect.left;
      const originY = targetRect.top + targetRect.height / 2 - layerRect.top;

      zoomLayer.style.transformOrigin = `${originX}px ${originY}px`;
    };

    const setBgOpacity = gsap.quickSetter(bgEl, "opacity");
    const setWhiteBackdropOpacity = gsap.quickSetter(whiteBackdropEl, "opacity");
    const setWhiteCoverOpacity = gsap.quickSetter(whiteCoverEl, "opacity");
    const setZoomOpacity = gsap.quickSetter(zoomLayer, "opacity");
    const setHintOpacity = gsap.quickSetter(hintEl, "opacity");

    let isZooming = false;
    let isSettled = false;

    updateZoomOrigin();
    const onRefresh = () => updateZoomOrigin();
    ScrollTrigger.addEventListener("refresh", onRefresh);
    window.addEventListener("resize", updateZoomOrigin);
    const originTimer = window.setTimeout(updateZoomOrigin, 1100);

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom top",
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const p = self.progress;
        zoomProgressRef.current = p;

        const zoomT = Math.min(1, p / 0.8);
        const textScale = 1 + Math.pow(zoomT, 2.8) * scaleMultiplier;

        const backdrop = Math.min(1, Math.max(0, (p - 0.2) / 0.45));
        const cover = Math.min(1, Math.max(0, (p - 0.7) / 0.16));
        const textFade = Math.max(0, 1 - Math.max(0, (p - 0.66) / 0.14));

        gsap.set(zoomLayer, {
          scale: textScale,
          force3D: true,
        });
        setZoomOpacity(textFade);
        setBgOpacity(Math.max(0, 1 - backdrop * 1.2));
        setWhiteBackdropOpacity(backdrop);
        setWhiteCoverOpacity(cover);
        setHintOpacity(Math.max(0, 1 - p * 5));

        const shouldZoom = p > 0.01;
        if (shouldZoom !== isZooming) {
          isZooming = shouldZoom;
          stickyEl.classList.toggle("hero--zooming", shouldZoom);
        }

        const shouldSettle = p > 0.68;
        if (shouldSettle !== isSettled) {
          isSettled = shouldSettle;
          stickyEl.classList.toggle("hero--settled", shouldSettle);
        }
      },
    });

    return () => {
      window.clearTimeout(originTimer);
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      window.removeEventListener("resize", updateZoomOrigin);
      st.kill();
    };
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
      tiltRef.current = {
        x: Math.sin(t * 0.9) * 0.35,
        y: Math.cos(t * 0.7) * 0.25,
      };
      applyTilt();
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isTouchDevice, applyTilt]);

  const handlePointerMove = useCallback(
    (clientX: number, clientY: number) => {
      const { innerWidth, innerHeight } = window;
      tiltRef.current = {
        x: (clientX / innerWidth) * 2 - 1,
        y: (clientY / innerHeight) * 2 - 1,
      };

      if (!tiltRafRef.current) {
        tiltRafRef.current = requestAnimationFrame(() => {
          applyTilt();
          tiltRafRef.current = 0;
        });
      }
    },
    [applyTilt],
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

  return (
    <section
      ref={sectionRef}
      className="hero-scroll-track relative min-h-[280svh] w-full bg-[#f5f5f7]"
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
        <div
          ref={bgRef}
          className="hero-bg-layers pointer-events-none absolute inset-0 z-0"
          aria-hidden="true"
        >
          <div className="video-montage-bg absolute inset-0 opacity-40" />
          <div className="noise-bg absolute inset-0 z-10 mix-blend-overlay opacity-20" />
        </div>

        <div
          ref={whiteBackdropRef}
          className="hero-white-backdrop pointer-events-none absolute inset-0 z-[12] bg-[#f5f5f7] opacity-0"
          aria-hidden="true"
        />

        <div
          ref={zoomLayerRef}
          className="hero-zoom-layer zoom-through-letter relative z-20 w-full max-w-[92vw]"
        >
          <div
            ref={tiltLayerRef}
            className={`hero-tilt-layer flex w-full flex-col items-center justify-center text-center ${hasEntered ? "hero-enter-active" : "hero-enter"}`}
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
                <span ref={zoomTargetRef} className="hero-zoom-target">
                  M
                </span>
                ATHEUS
              </span>
              <span
                className={`glitch-text mt-1 block text-[13vw] text-zinc-300 sm:text-[10vw] ${isTouchDevice ? "glitch-text-auto" : ""}`}
                data-text="NASCIMENTO"
              >
                NASCIMENT<span className="text-red-600">O</span>
              </span>
            </div>
          </div>
        </div>

        <div
          ref={whiteCoverRef}
          className="hero-white-cover pointer-events-none absolute inset-0 z-30 bg-[#f5f5f7] opacity-0"
          aria-hidden="true"
        />

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
