import { useEffect, useRef, type RefObject } from "react";
import {
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";

/*
 * House + "CHALET BEYOND" in Thunder, arriving as the Tatras. While the
 * footer scrolls in, every letter stands stretched to a peak's height with
 * its top cut to a summit, so the name reads as the range the chalet looks
 * at — L, the tallest, for Lomnický štít — with the house at its foot. As
 * the footer settles, the peaks come down and square off into the wordmark.
 * The shape is written to SVG attributes from the scroll value, never a
 * React render.
 * Metrics: Thunder 600 at 125 units has an 88.75 cap height. Each letter's
 * slot was measured from the whole word set at textLength 561 from x 114;
 * per-letter textLength pins the slots if the font has not loaded.
 */
const WIDTH = 676;
const BASELINE = 94;
const CAP = 88.75;
const CAP_TOP = BASELINE - CAP;
/** [letter, x, advance, peak height as a multiple of the cap height]. */
const LETTERS: [string, number, number, number][] = [
  ["C", 114, 49.8, 1.35],
  ["H", 163.8, 48.5, 1.6],
  ["A", 212.3, 47.9, 1.45],
  ["L", 260.2, 35.1, 1.95],
  ["E", 295.3, 36.5, 1.7],
  ["T", 331.8, 43.8, 1.4],
  ["B", 397.4, 49.3, 1.55],
  ["E", 446.7, 36.5, 1.8],
  ["Y", 483.2, 42.1, 1.5],
  ["O", 525.3, 49.8, 1.65],
  ["N", 575.1, 50.5, 1.3],
  ["D", 625.6, 49.4, 1.15],
];
const TALLEST = Math.max(...LETTERS.map(([, , , peak]) => peak));
/** How far a summit's flanks fall, as a share of the letter's width. */
const FLANK = 0.5;
/** Clear of round overshoot (C, O) once the peaks have squared off. */
const CLEARANCE = 3;
/** Room above the mark the peaks may use, in CSS px: the footer's top padding. */
const HEADROOM_PX = 56;
// The logo's house (54 x 56): body with chimney, and its amber side face.
const HOUSE = "M0 24 26.5 0 37 9.5V2h9v15l8 7.5V56H0Z";
const FACE = "M36.5 31.5 54 24.5V56H36.5Z";
const HOUSE_TRANSFORM = `translate(0 ${CAP_TOP}) scale(${CAP / 56})`;

/** 1 while the footer is coming in, 0 once it has settled. */
const rangeAt = (progress: number) => {
  const t = Math.min(1, Math.max(0, (progress - 0.2) / 0.8));
  return 1 - t * t * (3 - 2 * t);
};

/** The summits' outline; everything below it is drawn. */
function ridgeAt(amount: number, stretchLimit: number) {
  const points = [`-10 200`, `-10 -300`, `${LETTERS[0][1]} -300`];
  for (const [, x, w, peak] of LETTERS) {
    const stretch = 1 + (peak - 1) * amount * stretchLimit;
    const top = BASELINE - CAP * stretch - CLEARANCE;
    const flank = w * FLANK * amount;
    points.push(
      `${x} ${top + flank}`,
      `${x + w / 2} ${top}`,
      `${x + w} ${top + flank}`
    );
  }
  points.push(`${WIDTH + 10} -300`, `${WIDTH + 10} 200`);
  return `M${points.join("L")}Z`;
}

export function FooterMark({
  footer,
}: {
  footer: RefObject<HTMLElement | null>;
}) {
  const reduce = useReducedMotion();
  const svg = useRef<SVGSVGElement>(null);
  const ridge = useRef<SVGPathElement>(null);
  const letters = useRef<(SVGTextElement | null)[]>([]);
  // On a wide footer the mark is drawn large; scale the peaks down so the
  // tallest still fits in the padding above it.
  const stretchLimit = useRef(1);
  const { scrollYProgress } = useScroll({
    target: footer,
    offset: ["start end", "end end"],
  });
  // A little lag: the range settles into place rather than tracking the thumb.
  const level = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001,
  });
  const write = (progress: number) => {
    const amount = reduce ? 0 : rangeAt(progress);
    ridge.current?.setAttribute("d", ridgeAt(amount, stretchLimit.current));
    LETTERS.forEach(([, , , peak], i) => {
      const stretch = 1 + (peak - 1) * amount * stretchLimit.current;
      letters.current[i]?.setAttribute(
        "transform",
        `matrix(1 0 0 ${stretch} 0 ${BASELINE * (1 - stretch)})`
      );
    });
  };
  useMotionValueEvent(level, "change", write);
  useEffect(() => {
    const node = svg.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => {
      const scale = entry.contentRect.width / WIDTH;
      const tallestPx = CAP * (TALLEST - 1) * scale;
      stretchLimit.current = Math.min(1, HEADROOM_PX / tallestPx);
      write(level.get());
    });
    observer.observe(node);
    return () => observer.disconnect();
  });
  return (
    <svg
      ref={svg}
      className="footer-mark"
      viewBox={`0 0 ${WIDTH} 100`}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <clipPath id="footer-range">
          <path ref={ridge} d={ridgeAt(reduce ? 0 : 1, 1)} />
        </clipPath>
      </defs>
      <g transform={HOUSE_TRANSFORM}>
        <path d={HOUSE} style={{ fill: "var(--foreground)" }} />
        <path d={FACE} style={{ fill: "var(--amber)" }} />
      </g>
      <g clipPath="url(#footer-range)" style={{ fill: "var(--foreground)" }}>
        {LETTERS.map(([letter, x, w], i) => (
          <text
            key={i}
            ref={node => {
              letters.current[i] = node;
            }}
            x={x}
            y={BASELINE}
            textLength={w}
            lengthAdjust="spacingAndGlyphs"
            fontFamily="Thunder, sans-serif"
            fontWeight="600"
            fontSize="125"
          >
            {letter}
          </text>
        ))}
      </g>
    </svg>
  );
}
