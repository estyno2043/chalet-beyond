/*
 * CHALET BEYOND — BrandReveal
 * ----------------------------------------------------------------------------
 * Reusable brand title reveal. Clones the EXACT technique of the original
 * page-load intro (formerly in cinematic-landing-hero.tsx, GSAP):
 *   - "CHALET"  → text-track: opacity/translateY/scale/blur settle, expo.out
 *   - "BEYOND"  → clip-path wipe inset(0 100% 0 0) → inset(0 0 0 0), power4.inOut
 * The GSAP tween values are reproduced here as pure CSS @keyframes so the same
 * reveal can be (a) kept as the page-load intro and (b) replayed scroll-triggered
 * at the end of chapter 3. Mount the component (or change its `key`) to play.
 */
import { memo } from "react";

interface BrandRevealProps {
  /** Small mono line above the title (e.g. coordinates). */
  topLine?: string;
  /** Spaced caption under the title — animates in 0.4s after the name. */
  subtitle?: string;
  /** Show the settling vertical scroll line at the very bottom. */
  showScrollCue?: boolean;
}

const STYLES = `
  /* expo.out — matches GSAP ease "expo.out" used by cb-text-track */
  @keyframes brTrack {
    0%   { opacity: 0; transform: translateY(60px) scale(0.85); filter: blur(20px); }
    100% { opacity: 1; transform: translateY(0)    scale(1);    filter: blur(0);   }
  }
  /* power4.inOut clip wipe — matches GSAP cb-text-reveal */
  @keyframes brClip {
    0%   { clip-path: inset(0 100% 0 0); -webkit-clip-path: inset(0 100% 0 0); }
    100% { clip-path: inset(0 0% 0 0);   -webkit-clip-path: inset(0 0% 0 0);   }
  }
  @keyframes brUp {
    0%   { opacity: 0; transform: translateY(20px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  @keyframes brLine {
    0%, 100% { opacity: 0.28; transform: scaleY(0.82); }
    55%      { opacity: 1;    transform: scaleY(1); }
  }

  .br-root { animation: brUp 0.01s linear; } /* container fade guard */

  /* Contrast scrim so the title reads over bright video frames (e.g. golf sky) */
  .br-scrim {
    position: absolute;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    background: radial-gradient(ellipse 60% 45% at 50% 50%, rgba(0,0,0,0.55) 0%, transparent 72%);
  }

  .br-top {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(0.6rem, 1.5vw, 0.85rem);
    letter-spacing: 0.25em;
    color: oklch(0.62 0.10 65);
    text-transform: uppercase;
    margin-bottom: 0.85rem;
    opacity: 0;
    animation: brUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
  }

  /* "CHALET" — track settle (expo.out, ~1.6s) */
  .br-chalet {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(3.2rem, 12vw, 9rem);
    letter-spacing: -0.01em;
    line-height: 0.95;
    margin: 0 0 0.25rem;
    color: oklch(0.92 0.008 75);
    text-shadow:
      0 0 80px rgba(180,120,40,0.4),
      0 10px 30px rgba(0,0,0,0.6),
      0 2px 4px rgba(0,0,0,0.4);
    animation: brTrack 1.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
  }

  /* "BEYOND" — amber gradient + clip-path wipe (power4.inOut, 1.3s, delay 0.7s) */
  .br-beyond {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(3.2rem, 12vw, 9rem);
    letter-spacing: -0.01em;
    line-height: 0.95;
    margin: 0;
    background: linear-gradient(180deg, oklch(0.82 0.14 70) 0%, oklch(0.66 0.13 62) 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: drop-shadow(0 2px 6px rgba(0,0,0,0.7)) drop-shadow(0 0 34px rgba(180,120,40,0.55));
    transform: translateZ(0);
    animation: brClip 1.3s cubic-bezier(0.77, 0, 0.175, 1) 0.7s both;
  }

  .br-sub {
    margin: 1.4rem 0 0;
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(0.66rem, 1.6vw, 0.95rem);
    font-weight: 400;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: oklch(0.72 0.015 75);
    /* 0.4s after the title name reveal kicks off */
    opacity: 0;
    animation: brUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) 1.1s both;
  }

  .br-cue {
    position: absolute;
    bottom: 2.5rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.6rem;
    opacity: 0;
    animation: brUp 0.8s ease 2.4s both;
  }
  .br-cue-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.6rem;
    letter-spacing: 0.36em;
    text-transform: uppercase;
    color: oklch(0.58 0.020 65);
  }
  .br-cue-line {
    width: 1px;
    height: 38px;
    background: oklch(0.72 0.12 65 / 0.55);
    transform-origin: top;
    animation: brLine 2.3s ease-in-out 3s infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .br-top, .br-chalet, .br-beyond, .br-sub, .br-cue, .br-cue-line {
      animation: none !important;
      opacity: 1 !important;
      transform: none !important;
      clip-path: inset(0 0 0 0) !important;
      -webkit-clip-path: inset(0 0 0 0) !important;
      filter: none;
    }
  }
`;

export const BrandReveal = memo(function BrandReveal({
  topLine,
  subtitle,
  showScrollCue = false,
}: BrandRevealProps) {
  return (
    <div className="br-root absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-6 pointer-events-none">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="br-scrim" aria-hidden="true" />
      {topLine ? <p className="br-top">{topLine}</p> : null}
      <h2 className="br-chalet">CHALET</h2>
      <h2 className="br-beyond">BEYOND</h2>
      {subtitle ? <p className="br-sub">{subtitle}</p> : null}
      {showScrollCue ? (
        <div className="br-cue">
          <span className="br-cue-label">Scroll</span>
          <div className="br-cue-line" />
        </div>
      ) : null}
    </div>
  );
});
