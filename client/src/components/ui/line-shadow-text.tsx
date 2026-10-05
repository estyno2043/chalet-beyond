/*
 * Line Shadow Text — Magic UI (magicui.design/r/line-shadow-text).
 * Markup and classes as published; `motion/react` mapped to framer-motion's
 * lazy `m` components (the app runs under LazyMotion). The keyframes live in
 * index.css (`--animate-line-shadow`); reduced motion keeps a still shadow.
 */
import { type CSSProperties, type HTMLAttributes } from "react";
import { m, type MotionProps } from "framer-motion";

import { cn } from "@/lib/utils";

const motionElements = {
  article: m.article,
  div: m.div,
  h1: m.h1,
  h2: m.h2,
  h3: m.h3,
  h4: m.h4,
  h5: m.h5,
  h6: m.h6,
  li: m.li,
  p: m.p,
  section: m.section,
  span: m.span,
} as const;

type MotionElementType = keyof typeof motionElements;

interface LineShadowTextProps
  extends Omit<HTMLAttributes<HTMLElement>, keyof MotionProps>,
    MotionProps {
  children: string;
  shadowColor?: string;
  as?: MotionElementType;
}

export function LineShadowText({
  children,
  shadowColor = "black",
  className,
  as: Component = "span",
  ...props
}: LineShadowTextProps) {
  const MotionComponent = motionElements[Component];

  return (
    <MotionComponent
      style={{ "--shadow-color": shadowColor } as CSSProperties}
      className={cn(
        "relative z-0 inline-flex",
        "after:absolute after:top-[0.04em] after:left-[0.04em] after:content-[attr(data-text)]",
        "after:bg-[linear-gradient(45deg,transparent_45%,var(--shadow-color)_45%,var(--shadow-color)_55%,transparent_0)]",
        "after:-z-10 after:bg-size-[0.06em_0.06em] after:bg-clip-text after:text-transparent",
        "after:animate-line-shadow motion-reduce:after:animate-none",
        className
      )}
      data-text={children}
      {...props}
    >
      {children}
    </MotionComponent>
  );
}
