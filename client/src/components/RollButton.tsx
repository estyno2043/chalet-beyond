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
import {
  useEffect,
  useRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
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

function useMagnetic<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node || typeof window === "undefined") return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduce.matches) return;

    const onMouseMove = (e: MouseEvent) => {
      const rect = node.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      node.style.transform = `translate3d(${x * 0.14}px, ${y * 0.18}px, 0)`;
    };
    const onMouseLeave = () => {
      node.style.transform = "";
    };
    node.addEventListener("mousemove", onMouseMove);
    node.addEventListener("mouseleave", onMouseLeave);
    return () => {
      node.removeEventListener("mousemove", onMouseMove);
      node.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);
  return ref;
}

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
  const ref = useMagnetic<HTMLAnchorElement>();
  return (
    <a
      ref={ref}
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
  const ref = useMagnetic<HTMLButtonElement>();
  return (
    <button
      ref={ref}
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
