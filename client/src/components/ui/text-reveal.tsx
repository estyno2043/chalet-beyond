/*
 * Text Reveal — Magic UI (magicui.design/r/text-reveal), adapted for short
 * one-line copy. The published component pins its text in a 200vh sticky
 * wrapper; here each word's opacity follows the element's own pass through
 * the viewport instead (useScroll target + offset), so the text keeps its
 * normal place in the layout. Per-word ranges are as published; the 30%
 * ghost copy under each word is folded into the word's own opacity
 * (0.3 → 1, the same composite) so the text is not duplicated in the DOM.
 * `motion/react` is mapped to framer-motion's lazy `m`.
 * Reduced motion renders the plain text, fully visible.
 */
import { useRef, type ReactNode } from "react";
import {
  m,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

interface TextRevealProps {
  children: string;
  className?: string;
  as?: "p" | "dd" | "span";
}

export function TextReveal({
  children,
  className,
  as: Component = "p",
}: TextRevealProps) {
  const reduce = useReducedMotion();
  if (reduce) return <Component className={className}>{children}</Component>;
  return (
    <ScrollReveal className={className} as={Component}>
      {children}
    </ScrollReveal>
  );
}

function ScrollReveal({
  children,
  className,
  as: Component = "p",
}: TextRevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  // 0 when the text's top crosses 92% of the viewport, 1 at 55%.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.92", "start 0.55"],
  });

  const words = children.split(" ");

  return (
    <Component ref={ref as never} className={className}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return (
          <Word key={i} progress={scrollYProgress} range={[start, end]}>
            {i < words.length - 1 ? `${word} ` : word}
          </Word>
        );
      })}
    </Component>
  );
}

interface WordProps {
  children: ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
}

function Word({ children, progress, range }: WordProps) {
  const opacity = useTransform(progress, range, [0.3, 1]);
  return <m.span style={{ opacity }}>{children}</m.span>;
}
