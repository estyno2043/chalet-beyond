import Lenis from "lenis";
import "lenis/dist/lenis.css";

/**
 * Momentum scrolling for mouse wheels and trackpads, so the page glides and
 * settles the way it does on an iPhone instead of stepping per notch.
 *
 * Touch screens keep native scrolling — iOS and Android already have real
 * momentum — and reduced motion keeps the browser's own scroll. Scroll-driven
 * CSS timelines and framer-motion's useScroll still read the real window
 * scroll, which Lenis moves every frame.
 */
export function startSmoothScroll() {
  const pointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!pointer.matches || reduced.matches) return;

  new Lenis({
    autoRaf: true,
    // Lenis damps at lerp × 60 per second: 0.14 is 95% of the way in ~350 ms,
    // a glide that still answers the next wheel notch. 0.08 took ~600 ms and
    // trailed the wheel.
    lerp: 0.14,
    // The mobile menu and the price table scroll on their own.
    allowNestedScroll: true,
    // The lightbox and the mobile menu lock the page with overflow: hidden;
    // leave the wheel to the browser while they are open.
    virtualScroll: () =>
      document.documentElement.style.overflow !== "hidden" &&
      document.body.style.overflow !== "hidden",
  });
}
