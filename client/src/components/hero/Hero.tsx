/*
 * CHALET BEYOND — hero.
 *
 * One looping shot, the brand over it, and the booking action underneath.
 * Same structure on every width; only the footage changes, because a portrait
 * phone and a landscape laptop want different framing of the same place.
 *
 * This replaced two very different heroes: a scroll-scrubbed video that wrote
 * currentTime from an endless rAF loop, and a three-photograph story whose
 * stills changed aspect ratio and composition between scenes, so every
 * hand-over jumped. A single loop has neither problem.
 *
 * The video never gates the first paint. A poster paints immediately and the
 * source is attached afterwards, gated on visibility — requestAnimationFrame
 * does not run in a hidden tab, so a page opened in the background would
 * otherwise look like the video had simply failed.
 */
import { useEffect, useRef, useState } from "react";
import { BrandReveal } from "@/components/BrandReveal";
import { HeroActions } from "@/components/hero/HeroActions";
import { useT } from "@/i18n/LanguageProvider";

/** The page background. The hero dissolves into exactly this, so the join is
 *  a gradient rather than an edge. */
const PAGE_BG = "oklch(0.06 0.008 55)";

export function Hero({
  video,
  poster,
  compact = false,
}: {
  video: string;
  poster: string;
  compact?: boolean;
}) {
  const t = useT();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string>();

  useEffect(() => {
    let raf = 0;
    const start = () => {
      raf = requestAnimationFrame(() => setSrc(video));
    };

    if (!document.hidden) {
      start();
      return () => cancelAnimationFrame(raf);
    }
    const onVisible = () => {
      if (document.hidden) return;
      document.removeEventListener("visibilitychange", onVisible);
      start();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      cancelAnimationFrame(raf);
    };
  }, [video]);

  useEffect(() => {
    if (!src) return;
    // iOS occasionally blocks autoplay until an explicit play(). Failing is
    // fine: the poster is a still of this very footage.
    videoRef.current?.play().catch(() => {});
  }, [src]);

  return (
    <div
      id="hero"
      className="relative overflow-hidden"
      style={{ height: "100svh", background: PAGE_BG }}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        style={{ objectFit: "cover", objectPosition: "center" }}
      />

      {/* Two jobs, one layer: darken the top so the navigation reads, and take
          the bottom all the way down to the page background so the hero does
          not end on a line. The last stop is the page colour at full opacity —
          anything less leaves a visible seam where the section starts. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom,
            oklch(0.04 0.008 55 / 0.55) 0%,
            transparent 24%,
            transparent 42%,
            oklch(0.05 0.008 55 / 0.72) 74%,
            ${PAGE_BG} 100%)`,
        }}
      />

      {/* BrandReveal centres itself inside its nearest positioned ancestor.
          Given the whole hero it centres on the whole hero, and its tagline
          lands on top of the actions — measured, 603 against 559. Bounding it
          to the space above them makes the two blocks share the frame instead
          of competing for the middle of it. */}
      <div
        className="absolute inset-x-0 top-0"
        style={{ height: compact ? "calc(100% - 17rem)" : "calc(100% - 15rem)" }}
      >
        <BrandReveal subtitle={t.hero.tagline} />
      </div>

      {/* Actions sit low, in a full-width row. The previous hero put them and
          the headline in an auto-width relative box with absolute children,
          which collapsed to zero width — the headline wrapped onto four lines
          and the subtitle landed on top of the button. */}
      <div
        className="absolute inset-x-0 flex justify-center px-6"
        style={{ bottom: compact ? "calc(2.5rem + env(safe-area-inset-bottom))" : "4rem" }}
      >
        <HeroActions compact={compact} />
      </div>
    </div>
  );
}
