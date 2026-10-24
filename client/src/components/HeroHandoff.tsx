import { useEffect, useRef, useState, type ReactNode } from "react";
import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";
import "./hero-handoff.css";

const MOBILE_QUERY = "(max-width: 767px)";

function useMobileHandoff() {
  const [mobile, setMobile] = useState(
    () => window.matchMedia(MOBILE_QUERY).matches
  );

  useEffect(() => {
    const query = window.matchMedia(MOBILE_QUERY);
    const update = () => setMobile(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return mobile;
}

function AnimatedHandoff({
  hero,
  children,
}: {
  hero: ReactNode;
  children: ReactNode;
}) {
  const heroRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.98]);
  const heroDim = useTransform(scrollYProgress, [0, 1], [0, 0.45]);

  return (
    <>
      <m.div
        ref={heroRef}
        className="hero-handoff__hero"
        style={
          reduce
            ? undefined
            : {
                y: heroY,
                scale: heroScale,
              }
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
      <div id="page-sheet" className="hero-handoff__sheet">
        {children}
      </div>
    </>
  );
}

/** The narrow touch layout scrolls in document flow, with no scroll paint loop. */
export function HeroHandoff({
  hero,
  children,
}: {
  hero: ReactNode;
  children: ReactNode;
}) {
  const mobile = useMobileHandoff();

  if (mobile) {
    return (
      <>
        <div className="hero-handoff__hero">{hero}</div>
        <div id="page-sheet" className="hero-handoff__sheet">
          {children}
        </div>
      </>
    );
  }

  return <AnimatedHandoff hero={hero}>{children}</AnimatedHandoff>;
}
