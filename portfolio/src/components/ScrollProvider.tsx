"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useLayoutEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

function isTouchDevice() {
  return window.matchMedia("(pointer: coarse)").matches;
}

export function ScrollProvider({ children }: { children: React.ReactNode }) {
  useLayoutEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) {
      ScrollTrigger.refresh();
      return;
    }

    const touch = isTouchDevice();

    const lenis = new Lenis({
      lerp: touch ? 0.12 : 0.1,
      smoothWheel: !touch,
      syncTouch: touch,
      syncTouchLerp: 0.085,
      touchInertiaExponent: 1.65,
      touchMultiplier: 1.15,
      wheelMultiplier: 0.9,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.config({ ignoreMobileResize: true });
    ScrollTrigger.refresh();

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);

    if (touch) {
      window.addEventListener("orientationchange", refresh);
    } else {
      window.addEventListener("resize", refresh);
    }

    return () => {
      window.removeEventListener("load", refresh);
      if (touch) {
        window.removeEventListener("orientationchange", refresh);
      } else {
        window.removeEventListener("resize", refresh);
      }
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
    };
  }, []);

  return children;
}
