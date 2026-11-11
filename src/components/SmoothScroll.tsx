"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEffect } from "react";
import { definirLenis } from "@/lib/rolagem";

gsap.registerPlugin(ScrollTrigger);

/**
 * Rolagem suave com Lenis, sincronizada com o ScrollTrigger pelo relógio do GSAP.
 * Desligada em prefers-reduced-motion. No toque, a rolagem nativa é mantida (mais leve).
 */
export function SmoothScroll() {
  useEffect(() => {
    ScrollTrigger.config({ ignoreMobileResize: true });
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ autoRaf: false, lerp: 0.1, smoothWheel: true });
    definirLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (tempo: number) => lenis.raf(tempo * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      definirLenis(null);
    };
  }, []);

  return null;
}
