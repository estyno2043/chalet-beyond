/**
 * ScrollProgressBar — Chalet Beyond
 * Fixed amber gradient line at the very top of the viewport
 * Driven by Framer Motion useScroll + scaleX transform
 * GPU-only animation (transform), no layout/paint cost
 */
import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();

  // Spring smoothing: snappy follow with slight lag for elegance
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{
        scaleX,
        transformOrigin: "left",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "2px",
        zIndex: 200,
        background:
          "linear-gradient(90deg, oklch(0.60 0.10 60) 0%, oklch(0.78 0.14 65) 55%, oklch(0.88 0.10 75) 100%)",
        boxShadow: "0 0 8px oklch(0.72 0.12 65 / 0.6), 0 0 20px oklch(0.72 0.12 65 / 0.25)",
        willChange: "transform",
      }}
    />
  );
}
