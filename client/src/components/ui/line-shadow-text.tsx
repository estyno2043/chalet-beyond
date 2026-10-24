/*
 * Line Shadow Text — Magic UI (magicui.design/r/line-shadow-text).
 * Markup and classes as published. The keyframes live in index.css
 * (`--animate-line-shadow`); reduced motion keeps a still shadow.
 */
import {
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
} from "react";

import { cn } from "@/lib/utils";

interface LineShadowTextProps extends HTMLAttributes<HTMLElement> {
  children: string;
  shadowColor?: string;
  as?: ElementType;
}

export function LineShadowText({
  children,
  shadowColor = "black",
  className,
  as: Component = "span",
  ...props
}: LineShadowTextProps) {
  return (
    <Component
      style={{ "--shadow-color": shadowColor } as CSSProperties}
      className={cn(
        "relative z-0 inline-flex",
        "after:absolute after:top-[0.04em] after:left-[0.04em] after:content-[attr(data-text)]",
        // Offset by 0.04em, the copy is wider than its box; never let it wrap.
        "after:whitespace-nowrap",
        "after:bg-[linear-gradient(45deg,transparent_45%,var(--shadow-color)_45%,var(--shadow-color)_55%,transparent_0)]",
        "after:-z-10 after:bg-size-[0.06em_0.06em] after:bg-clip-text after:text-transparent",
        "after:animate-line-shadow motion-reduce:after:animate-none",
        className
      )}
      data-text={children}
      {...props}
    >
      {children}
    </Component>
  );
}
