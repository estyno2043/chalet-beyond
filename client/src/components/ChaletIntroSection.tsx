import { SectionHeader } from "./premium/SectionHeader";
import { SectionBackdrop } from "./premium/SectionBackdrop";
import { usePremiumCopy } from "./premium/copy";
import { Meteors } from "./ui/meteors";

/**
 * The chalet panorama behind the intro. The owner will supply a night photo:
 * export it with scripts/export-chalet-photos.py and change this one id.
 */
export const INTRO_PANORAMA_PHOTO_ID = 39;

export function ChaletIntroSection() {
  const c = usePremiumCopy();
  return (
    <section id="chalet" className="premium-section intro-section">
      {/* Decorative: a faint panorama with meteors over its sky. */}
      <SectionBackdrop
        photoId={INTRO_PANORAMA_PHOTO_ID}
        className="intro-backdrop"
      >
        <div className="intro-backdrop__meteors">
          <Meteors number={14} minDuration={4} maxDuration={10} />
        </div>
      </SectionBackdrop>
      <div className="container intro-content">
        <SectionHeader
          lines={c.intro}
          lineShadow="oklch(0.85 0.06 74 / 0.55)"
          className="intro-header"
        />
        <dl className="intro-facts">
          {c.facts.map(([title, text]) => (
            <div key={title}>
              <dt>{title}</dt>
              <dd>{text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
