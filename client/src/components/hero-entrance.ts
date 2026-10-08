/*
 * Hero title entrance. Every letter appears at the hero's centre and glides
 * left into its slot; CHALET runs first, BEYOND follows once CHALET is mostly
 * home. The whole sequence is ~1.3 s — about what the first video frame
 * needs — so the wait reads as choreography instead of a loading poster.
 *
 * Shared by two callers. On prerendered pages the inline boot script
 * (hero-boot.ts) starts it on the static title before the first paint; when
 * React mounts it replaces that title, and Hero.tsx carries the entrance on
 * from the same point on its own letters. Without prerendering (vite dev)
 * Hero.tsx starts it itself.
 */

const LETTER_MS = 680;
const LETTER_STAGGER_MS = 34;
/** Share of each letter's time spent appearing at the centre before it glides. */
const APPEAR_AT = 0.16;
/** Quint out: long enough a tail that the glide reads as travel, not a jump. */
const EASE_GLIDE = "cubic-bezier(0.22, 1, 0.36, 1)";
const TITLE_FONT = "600 1em Thunder";
/** A slow font must not hold the title hostage. */
const FONT_WAIT_MS = 700;

/** What the boot script hands over to React. Times are `performance.now()`. */
export type HeroBoot = {
  /** When the prerendered hero was parsed; its CSS reveals started then. */
  parsedAt: number;
  /** When the title entrance started, once it has. */
  startedAt?: number;
};

declare global {
  interface Window {
    __heroBoot?: HeroBoot;
  }
}

/**
 * Resolves once Thunder is in, or after FONT_WAIT_MS with whatever face is on
 * screen. Letters are measured in it, so they must start from the real centre
 * and land on their real slots. The face is preloaded, so usually it is here.
 */
export function titleFontReady(): Promise<unknown> {
  const fonts = document.fonts;
  if (!fonts || fonts.check(TITLE_FONT)) return Promise.resolve();
  return Promise.race([
    fonts.load(TITLE_FONT),
    new Promise(resolve => setTimeout(resolve, FONT_WAIT_MS)),
  ]).catch(() => {});
}

/**
 * Starts the entrance, or continues it `elapsed` ms in. WAAPI keeps it on the
 * compositor while the video and the rest of the page are still loading.
 */
export function playTitleEntrance(
  section: HTMLElement,
  title: HTMLElement,
  elapsed = 0
): Animation[] {
  const centre = section.getBoundingClientRect();
  const centreX = centre.left + centre.width / 2;
  const lines = title.querySelectorAll<HTMLElement>("[data-line]");
  /** BEYOND starts when CHALET's last letter is halfway in: a short gap, not a pause. */
  const secondLineAt =
    (lines[0].querySelectorAll("[data-letter]").length - 1) *
      LETTER_STAGGER_MS +
    LETTER_MS * 0.5;
  const animations: Animation[] = [];

  lines.forEach((line, lineIndex) => {
    line.querySelectorAll<HTMLElement>("[data-letter]").forEach((letter, i) => {
      const box = letter.getBoundingClientRect();
      const dx = centreX - (box.left + box.width / 2);
      const animation = letter.animate(
        [
          // Born at the centre: fades up almost in place…
          {
            opacity: 0,
            transform: `translate3d(${dx}px, 0, 0) scale(1.06)`,
            filter: "blur(8px)",
            easing: "ease-out",
          },
          {
            opacity: 1,
            transform: `translate3d(${dx * 0.94}px, 0, 0) scale(1.04)`,
            filter: "blur(3px)",
            offset: APPEAR_AT,
            easing: EASE_GLIDE,
          },
          // …then glides left into its slot and sharpens on arrival.
          {
            opacity: 1,
            transform: "translate3d(0, 0, 0) scale(1)",
            filter: "blur(0px)",
          },
        ],
        {
          duration: LETTER_MS,
          delay: lineIndex * secondLineAt + i * LETTER_STAGGER_MS,
          fill: "backwards",
        }
      );
      if (elapsed > 0) animation.currentTime = elapsed;
      animations.push(animation);
    });
  });
  title.dataset.intro = "running";
  return animations;
}
