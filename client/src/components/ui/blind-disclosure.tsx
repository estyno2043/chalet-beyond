import {
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import "./blind-disclosure.css";

/**
 * A disclosure that opens like a window blind being lowered: the panel's
 * lower edge travels down, and every descendant marked `data-slat` tilts
 * open in sequence from the top. The plus turns 45° into a cross; closing
 * rolls the blind back up. Closed content is inert (not focusable, not
 * announced). Reduced motion switches instantly.
 *
 * Styling hooks: `.blind-disclosure` (pass `className` for the frame),
 * `__trigger`, `__icon`, `__panel`, `__blind`.
 */
export function BlindDisclosure({
  summary,
  children,
  className = "",
  defaultOpen = false,
}: {
  summary: ReactNode;
  children: ReactNode;
  className?: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  const panel = useRef<HTMLDivElement>(null);

  // Number the slats so CSS can stagger them without knowing the content.
  useLayoutEffect(() => {
    panel.current
      ?.querySelectorAll<HTMLElement>("[data-slat]")
      .forEach((slat, index) => slat.style.setProperty("--slat", `${index}`));
  }, [children]);

  return (
    <div
      className={`blind-disclosure ${className}`}
      data-open={open || undefined}
    >
      <button
        type="button"
        className="blind-disclosure__trigger"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(value => !value)}
      >
        {summary}
        <span className="blind-disclosure__icon" aria-hidden="true" />
      </button>
      <div
        ref={panel}
        id={panelId}
        className="blind-disclosure__panel"
        inert={!open}
      >
        <div className="blind-disclosure__blind">{children}</div>
      </div>
    </div>
  );
}
