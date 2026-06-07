/**
 * useSmoothScroll — Lenis smooth scroll + GSAP ScrollTrigger integration
 * Chalet Beyond: provides buttery smooth scrolling across the entire page
 * Lenis handles the smooth inertia, GSAP ScrollTrigger syncs to it
 */
import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function useSmoothScroll() {
  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo ease
      orientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
    });

    // Sync Lenis scroll position with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Tick Lenis on each GSAP frame
    const ticker = gsap.ticker.add((time: number) => {
      lenis.raf(time * 1000);
    });

    // Disable GSAP's own lagSmoothing since Lenis handles it
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(ticker);
    };
  }, []);
}
