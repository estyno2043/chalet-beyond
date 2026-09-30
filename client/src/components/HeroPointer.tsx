import { useEffect, useRef, type RefObject } from "react";

/** Pointer motion stays in this leaf; no React renders or idle animation loop. */
export function HeroPointer({
  surface,
}: {
  surface: RefObject<HTMLElement | null>;
}) {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = surface.current;
    const cursor = cursorRef.current;
    if (!hero || !cursor) return;
    const eligible = window.matchMedia(
      "(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)"
    );
    let detach = () => {};
    const update = () => {
      detach();
      if (!eligible.matches) return;

      let frame = 0;
      let x = 0;
      let y = 0;
      let active: HTMLElement | null = null;
      let content: HTMLElement | null = null;
      let bounds: DOMRect | null = null;

      const resetControl = () => {
        if (content) content.style.transform = "";
        active = content = null;
        bounds = null;
        cursor.dataset.active = "false";
      };
      const hide = () => {
        cancelAnimationFrame(frame);
        frame = 0;
        cursor.dataset.visible = "false";
        resetControl();
      };
      const move = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") {
          hide();
          return;
        }
        x = event.clientX;
        y = event.clientY;
        const next = (event.target as Element).closest<HTMLElement>(
          "[data-hero-magnetic]"
        );
        if (next !== active) {
          resetControl();
          active = next;
          content =
            next?.querySelector<HTMLElement>(
              ".chalet-hero__reactive-content"
            ) ?? null;
          bounds = next?.getBoundingClientRect() ?? null;
          cursor.dataset.active = String(Boolean(next));
        }
        if (frame) return;
        // Coalesce high-rate pointer events into one small DOM write per frame.
        frame = requestAnimationFrame(() => {
          cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
          cursor.dataset.visible = "true";
          if (content && bounds) {
            const dx = Math.max(
              -4,
              Math.min(4, ((x - bounds.left) / bounds.width - 0.5) * 8)
            );
            const dy = Math.max(
              -3,
              Math.min(3, ((y - bounds.top) / bounds.height - 0.5) * 6)
            );
            content.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
          }
          frame = 0;
        });
      };
      const keydown = (event: KeyboardEvent) => {
        if (event.key === "Tab") hide();
      };
      hero.addEventListener("pointermove", move, { passive: true });
      hero.addEventListener("pointerleave", hide);
      window.addEventListener("scroll", hide, { passive: true });
      window.addEventListener("resize", hide);
      window.addEventListener("blur", hide);
      document.addEventListener("keydown", keydown);
      document.addEventListener("visibilitychange", hide);
      detach = () => {
        hide();
        hero.removeEventListener("pointermove", move);
        hero.removeEventListener("pointerleave", hide);
        window.removeEventListener("scroll", hide);
        window.removeEventListener("resize", hide);
        window.removeEventListener("blur", hide);
        document.removeEventListener("keydown", keydown);
        document.removeEventListener("visibilitychange", hide);
      };
    };
    update();
    eligible.addEventListener("change", update);
    return () => {
      detach();
      eligible.removeEventListener("change", update);
    };
  }, [surface]);

  return (
    <div ref={cursorRef} className="chalet-hero__cursor" aria-hidden="true">
      <span />
    </div>
  );
}
