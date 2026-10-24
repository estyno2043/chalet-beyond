import Lenis from "lenis";
import "lenis/dist/lenis.css";

let lenis: Lenis | null = null;

export function getLenis(): Lenis | null {
  return lenis;
}

/**
 * Momentum smooth scrolling for mouse wheels and trackpads, so the page glides
 * and settles with luxury precision instead of harsh steps per notch.
 *
 * Touch screens keep native momentum, and prefers-reduced-motion keeps native scroll.
 */
export function startSmoothScroll() {
  if (typeof window === "undefined" || lenis) return lenis;

  const pointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!pointer.matches || reduced.matches) return null;

  lenis = new Lenis({
    autoRaf: true,
    lerp: 0.1,
    duration: 1.2,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    allowNestedScroll: true,
    virtualScroll: () =>
      document.documentElement.style.overflow !== "hidden" &&
      document.body.style.overflow !== "hidden",
  });

  return lenis;
}

/** Smoothly glide to an element or selector, taking navbar offset into account. */
export function scrollTo(
  target: string | HTMLElement | number,
  options?: { offset?: number; immediate?: boolean; duration?: number }
) {
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const navOffset = options?.offset ?? -88;

  if (lenis && !reduced && !options?.immediate) {
    lenis.scrollTo(target, {
      offset: navOffset,
      duration: options?.duration ?? 1.2,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      immediate: options?.immediate ?? false,
    });
    return;
  }

  const behavior = reduced || options?.immediate ? "auto" : "smooth";

  if (typeof target === "number") {
    window.scrollTo({
      top: target,
      behavior,
    });
    return;
  }

  const el =
    typeof target === "string" ? document.querySelector(target) : target;
  if (!el) return;

  const y = el.getBoundingClientRect().top + window.scrollY + navOffset;
  window.scrollTo({
    top: Math.max(0, y),
    behavior,
  });
}
