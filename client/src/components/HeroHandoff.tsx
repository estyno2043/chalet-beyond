/*
 * HeroHandoff — the hero gives way to the page.
 *
 * As the guest scrolls, the rest of the page rises as one sheet with rounded
 * top corners and a soft upward shadow, and slides over the hero. The hero
 * does not simply scroll away: it moves up at roughly half speed, shrinks a
 * little towards its top edge, rounds its corners and dims, so it reads as
 * being pushed back by the sheet. The sheet's corners straighten as it lands
 * under the bar.
 *
 * Scroll-linked motion values from Motion (framer-motion, already a
 * dependency), applied as transforms only. Reduced motion: plain flow.
 */
import { useRef, type ReactNode } from "react";
import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";
import "./hero-handoff.css";

export function HeroHandoff({
  hero,
  children,
}: {
  hero: ReactNode;
  children: ReactNode;
}) {
  const heroRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  // 0 with the hero at rest, 1 once the page has scrolled one hero height.
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "48%"]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const heroRadius = useTransform(scrollYProgress, [0, 0.5, 1], [0, 20, 32]);
  const heroDim = useTransform(scrollYProgress, [0, 1], [0, 0.72]);
  const sheetRadius = useTransform(scrollYProgress, [0, 0.8, 1], [36, 28, 0]);

  return (
    <>
      <m.div
        ref={heroRef}
        className="hero-handoff__hero"
        style={
          reduce
            ? undefined
            : { y: heroY, scale: heroScale, borderRadius: heroRadius }
        }
      >
        {hero}
        {!reduce && (
          <m.div
            className="hero-handoff__dim"
            style={{ opacity: heroDim }}
            aria-hidden="true"
          />
        )}
      </m.div>
      <m.div
        id="page-sheet"
        className="hero-handoff__sheet"
        style={
          reduce
            ? undefined
            : {
                borderTopLeftRadius: sheetRadius,
                borderTopRightRadius: sheetRadius,
              }
        }
      >
        {children}
      </m.div>
    </>
  );
}
