import { SectionHeader } from "./premium/SectionHeader";
import { SectionBackdrop } from "./premium/SectionBackdrop";
import { usePremiumCopy } from "./premium/copy";
import { Meteors } from "./ui/meteors";
import { RollLink } from "./RollButton";

/**
 * The chalet panorama behind the intro: the owner's night version of photo
 * 39, so the meteors cross a real starry sky.
 */
export const INTRO_PANORAMA_PHOTO_ID = 80;

export function ChaletIntroSection() {
  const c = usePremiumCopy();

  return (
    <section id="chalet" className="premium-section intro-section">
      {/* Decorative: a faint panorama with meteors over its sky. */}
      <SectionBackdrop
        photoId={INTRO_PANORAMA_PHOTO_ID}
        className="intro-backdrop"
      >
        <div className="intro-backdrop__stars" aria-hidden="true" />
        <div className="intro-backdrop__meteors">
          <Meteors number={6} minDuration={5} maxDuration={12} />
        </div>
      </SectionBackdrop>
      <div className="container intro-content">
        <SectionHeader
          lines={c.intro}
          lineShadow="oklch(0.85 0.06 74 / 0.55)"
          className="intro-header"
        />
        <dl className="intro-facts">
          {c.facts.map(([title, text], i) => (
            <div key={title} className="intro-fact">
              <div className="intro-fact__header">
                <span className="intro-fact__index">0{i + 1}</span>
                <span className="intro-fact__label">{c.factLabels[i]}</span>
              </div>
              <dt>{title}</dt>
              <span className="intro-fact__divider" aria-hidden="true" />
              <dd>{text}</dd>
            </div>
          ))}
        </dl>
        {/* November Promotion Spotlight */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl border border-[oklch(0.72_0.12_65/0.3)] bg-gradient-to-r from-[oklch(0.12_0.012_55/0.85)] to-[oklch(0.08_0.01_55/0.95)] backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[oklch(0.72_0.12_65/0.08)] rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col gap-2 relative z-10 max-w-2xl text-left">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="size-1.5 rounded-full bg-[var(--amber)]" aria-hidden="true" />
              <span className="text-[var(--amber)] font-mono text-xs font-semibold tracking-widest uppercase">
                Limitovaná ponuka · Zľava −20 % na celý november
              </span>
            </div>
            <h3 className="font-['Thunder',sans-serif] text-2xl sm:text-3xl tracking-wide uppercase text-[oklch(0.97_0.007_75)] mt-0.5 font-semibold leading-tight">
              Celý súkromný chalet s wellnessom už od 240 € / noc
            </h3>
          </div>
          <div className="relative z-10 shrink-0 self-stretch sm:self-auto flex sm:block justify-center">
            <RollLink
              href="#rezervacia"
              onClick={e => {
                e.preventDefault();
                void import("@/lib/smooth-scroll").then(m => m.scrollTo("#rezervacia"));
              }}
              tone="solid"
              size="sm"
            >
              Využiť zľavu 20 % →
            </RollLink>
          </div>
        </div>
      </div>
    </section>
  );
}
