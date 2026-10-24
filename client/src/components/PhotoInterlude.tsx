import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Photo } from "./premium/Photo";
import { SectionHeader } from "./premium/SectionHeader";
import { usePremiumCopy } from "./premium/copy";

/** Slats of the blind that opens over the window view (premium.css). */
const BLIND_SLATS = 12;

export function PhotoInterlude() {
  const c = usePremiumCopy();
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    // If native animation-timeline: view() is supported, CSS handles it continuously
    if (
      typeof CSS !== "undefined" &&
      CSS.supports?.("animation-timeline", "view()")
    ) {
      return;
    }
    const node = sectionRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="photo-interlude"
      className="photo-interlude"
      data-inview={inView}
    >
      <Photo id={72} className="scroll-photo" />
      <div className="photo-shade" />
      <div className="interlude-blind" aria-hidden="true">
        {Array.from({ length: BLIND_SLATS }, (_, i) => (
          <span key={i} style={{ "--slat": i } as CSSProperties} />
        ))}
      </div>
      <div className="container">
        <SectionHeader lines={c.interlude} />
      </div>
    </section>
  );
}
