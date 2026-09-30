import { useEffect, useRef, type RefObject } from "react";

/*
 * Hero cursor ring. It trails the pointer slightly and gives way over any link
 * or button, where the control's own hover takes over. Nothing on the page
 * moves with the cursor — controls stay put.
 *
 * Written straight to the DOM from one rAF loop that only runs while the ring
 * is catching up: no React renders, no idle loop.
 */

/** Share of the remaining distance covered per frame; 1 would be glued on. */
const FOLLOW = 0.3;

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
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)"
    );
    let detach = () => {};

    const update = () => {
      detach();
      if (!eligible.matches) return;

      let frame = 0;
      let px = 0;
      let py = 0;
      let rx = 0;
      let ry = 0;
      let placed = false;

      const tick = () => {
        frame = 0;
        if (!placed) {
          rx = px;
          ry = py;
          placed = true;
        }
        rx += (px - rx) * FOLLOW;
        ry += (py - ry) * FOLLOW;
        cursor.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
        if (Math.abs(px - rx) + Math.abs(py - ry) > 0.1)
          frame = requestAnimationFrame(tick);
      };

      const move = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") {
          hide();
          return;
        }
        px = event.clientX;
        py = event.clientY;
        cursor.dataset.visible = "true";
        cursor.dataset.active = String(
          Boolean((event.target as Element).closest("a, button"))
        );
        if (!frame) frame = requestAnimationFrame(tick);
      };
      const hide = () => {
        placed = false;
        cursor.dataset.visible = "false";
        cursor.dataset.active = "false";
      };
      const keydown = (event: KeyboardEvent) => {
        if (event.key === "Tab") hide();
      };

      hero.addEventListener("pointermove", move, { passive: true });
      hero.addEventListener("pointerleave", hide);
      window.addEventListener("scroll", hide, { passive: true });
      window.addEventListener("blur", hide);
      document.addEventListener("keydown", keydown);
      document.addEventListener("visibilitychange", hide);
      detach = () => {
        hide();
        cancelAnimationFrame(frame);
        frame = 0;
        hero.removeEventListener("pointermove", move);
        hero.removeEventListener("pointerleave", hide);
        window.removeEventListener("scroll", hide);
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
