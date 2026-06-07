/**
 * useSmoothScroll — no-op, native scroll only
 * Lenis was removed because it conflicts with GSAP ScrollTrigger pin sections,
 * causing extreme slowdown. Native scroll + GSAP scrub handles smoothness.
 */
export function useSmoothScroll() {
  // intentionally empty — native scroll is used
}
