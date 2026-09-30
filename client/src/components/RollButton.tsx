/*
 * RollButton — pill CTA with a rising fill and a rolling label.
 *
 * Markup and hover logic adapted from Animata's Swipe Button (label copy that
 * rolls in from below) and Magic UI's Interactive Hover Button (a fill that
 * grows from inside the pill); styles rewritten to the Dark Timber tokens.
 *
 * The button itself never moves: the fill rises as a dome from the bottom and
 * the label rolls up, so the change reads as the button filling, not jumping.
 * The second label row is the filled state's copy, so its colour is correct
 * the moment it appears.
 */
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import "./roll-button.css";

type Tone = "outline" | "solid" | "ghost";
type Size = "lg" | "sm";

type Common = {
  children: ReactNode;
  icon?: ReactNode;
  tone?: Tone;
  size?: Size;
  className?: string;
};

function Face({ icon, children }: { icon?: ReactNode; children: ReactNode }) {
  return (
    <span className="roll-btn__label">
      <span className="roll-btn__row">
        {icon}
        <span>{children}</span>
      </span>
      <span className="roll-btn__row roll-btn__row--next" aria-hidden="true">
        {icon}
        <span>{children}</span>
      </span>
    </span>
  );
}

export function RollLink({
  children,
  icon,
  tone = "outline",
  size = "lg",
  className,
  ...props
}: Common & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      {...props}
      className={cn("roll-btn", className)}
      data-tone={tone}
      data-size={size}
    >
      <span className="roll-btn__fill" aria-hidden="true" />
      <Face icon={icon}>{children}</Face>
    </a>
  );
}

export function RollButton({
  children,
  icon,
  tone = "outline",
  size = "lg",
  className,
  type = "button",
  ...props
}: Common & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      type={type}
      className={cn("roll-btn", className)}
      data-tone={tone}
      data-size={size}
    >
      <span className="roll-btn__fill" aria-hidden="true" />
      <Face icon={icon}>{children}</Face>
    </button>
  );
}
