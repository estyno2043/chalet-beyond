import { useEffect, useRef, type RefObject } from "react";
import {
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";

/*
 * House + "CHALET BEYOND" in Thunder, filled like water poured into the
 * letters as the footer scrolls in. One SVG: the glyphs are drawn twice
 * (faint, then solid inside a clipPath whose wave-edged path rises). The
 * level is a transform attribute written from the scroll value, never a
 * React render; SMIL adds the slow horizontal drift on top of it.
 * Metrics: Thunder 600 at 125 units has an 88.75 cap height and a 560.875
 * advance; textLength pins that width if the font has not loaded.
 */
const WIDTH = 676;
const BASELINE = 94;
const CAP_TOP = BASELINE - 88.75;
const WAVELENGTH = 60;
const CREST = 6; // control-point offset; the wave rises and dips 3 units
const EMPTY = 100 + CREST / 2;
const FULL = CAP_TOP; // crests clear the caps, troughs lap just below them
const WAVE = (() => {
  const halves = Math.ceil((WIDTH + 2 * WAVELENGTH) / (WAVELENGTH / 2));
  const half = WAVELENGTH / 2;
  return `M${-WAVELENGTH} 0q${half / 2} ${-CREST} ${half} 0${` t${half} 0`.repeat(
    halves - 1
  )}V140H${-WAVELENGTH}Z`;
})();
// The logo's house (54 x 56): body with chimney, and its amber side face.
const HOUSE = "M0 24 26.5 0 37 9.5V2h9v15l8 7.5V56H0Z";
const FACE = "M36.5 31.5 54 24.5V56H36.5Z";
const HOUSE_TRANSFORM = `translate(0 ${CAP_TOP}) scale(${(BASELINE - CAP_TOP) / 56})`;
const levelAt = (progress: number) => EMPTY - progress * (EMPTY - FULL);

function Glyphs({ face, body }: { face: string; body: string }) {
  return (
    <>
      <g transform={HOUSE_TRANSFORM}>
        <path d={HOUSE} style={{ fill: body }} />
        <path d={FACE} style={{ fill: face }} />
      </g>
      <text
        x="114"
        y={BASELINE}
        textLength="561"
        lengthAdjust="spacingAndGlyphs"
        style={{ fill: body }}
        fontFamily="Thunder, sans-serif"
        fontWeight="600"
        fontSize="125"
      >
        CHALET BEYOND
      </text>
    </>
  );
}

export function FooterMark({
  footer,
}: {
  footer: RefObject<HTMLElement | null>;
}) {
  const reduce = useReducedMotion();
  const wave = useRef<SVGPathElement>(null);
  const { scrollYProgress } = useScroll({
    target: footer,
    offset: ["start end", "end end"],
  });
  // A little lag reads as liquid settling rather than a scrubbed mask.
  const level = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001,
  });
  const write = (progress: number) => {
    if (!reduce)
      wave.current?.setAttribute(
        "transform",
        `translate(0 ${levelAt(progress)})`
      );
  };
  useMotionValueEvent(level, "change", write);
  useEffect(() => write(level.get()));
  return (
    <svg
      className="footer-mark"
      viewBox={`0 0 ${WIDTH} 100`}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <clipPath id="footer-water">
          <path
            ref={wave}
            d={WAVE}
            transform={`translate(0 ${reduce ? -10 : EMPTY})`}
          >
            {!reduce && (
              <animateTransform
                attributeName="transform"
                type="translate"
                from="0 0"
                to={`${WAVELENGTH} 0`}
                dur="8s"
                repeatCount="indefinite"
                additive="sum"
              />
            )}
          </path>
        </clipPath>
      </defs>
      <Glyphs body="rgb(245 244 239 / 0.14)" face="rgb(245 244 239 / 0.14)" />
      <g clipPath="url(#footer-water)">
        <Glyphs body="var(--foreground)" face="var(--amber)" />
      </g>
    </svg>
  );
}
