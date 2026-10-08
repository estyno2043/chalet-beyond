import type { CSSProperties } from "react";
import { Photo } from "./premium/Photo";
import { SectionHeader } from "./premium/SectionHeader";
import { usePremiumCopy } from "./premium/copy";

/** Slats of the blind that opens over the window view (premium.css). */
const BLIND_SLATS = 12;

export function PhotoInterlude() {
  const c = usePremiumCopy();
  return (
    <section className="photo-interlude">
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
