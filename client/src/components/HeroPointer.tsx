import { useEffect, useRef, type RefObject } from "react";

/*
 * Hero pointer: a trailing cursor ring, magnetic buttons and a fill that grows
 * from the point where the cursor entered.
 *
 * Everything here is written straight to the DOM from one rAF loop that only
 * runs while something is moving — no React renders, no idle loop. The anchor
 * (the hit area) never moves; only its inner surface does.
 */

/** How far a button's surface may follow the cursor, in px. */
const PULL_X = 10;
const PULL_Y = 7;
/** Extra travel of the arrow cell on top of the surface: the "internal tension". */
const ICON_PULL = 4;
/** Damped spring: a little overshoot on release reads as mass, not as a snap. */
const STIFFNESS = 0.14;
const DAMPING = 0.72;
/** The ring trails the pointer slightly; 1 would be glued to it. */
const RING_FOLLOW = 0.32;

type Spring = { x: number; y: number; vx: number; vy: number };

function step(s: Spring, tx: number, ty: number) {
  s.vx = (s.vx + (tx - s.x) * STIFFNESS) * DAMPING;
  s.vy = (s.vy + (ty - s.y) * STIFFNESS) * DAMPING;
  s.x += s.vx;
  s.y += s.vy;
  return (
    Math.abs(tx - s.x) + Math.abs(ty - s.y) + Math.abs(s.vx) + Math.abs(s.vy) >
    0.05
  );
}

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
      if (!eligible.matches) {
        hero.dataset.pointer = "off";
        return;
      }
      hero.dataset.pointer = "on";

      let frame = 0;
      let px = 0;
      let py = 0;
      let visible = false;
      const ring = { x: 0, y: 0 };
      let ringPlaced = false;

      let active: HTMLElement | null = null;
      let bounds: DOMRect | null = null;
      // Buttons still springing back after the pointer left them.
      const springs = new Map<
        HTMLElement,
        { spring: Spring; face: HTMLElement | null; icon: HTMLElement | null }
      >();

      const entryFor = (button: HTMLElement) => {
        let entry = springs.get(button);
        if (!entry) {
          entry = {
            spring: { x: 0, y: 0, vx: 0, vy: 0 },
            face: button.querySelector<HTMLElement>(".hero-btn__surface"),
            icon: button.querySelector<HTMLElement>(
              ".hero-btn__surface > .hero-btn__face .hero-btn__icon"
            ),
          };
          springs.set(button, entry);
        }
        return entry;
      };

      const setOrigin = (button: HTMLElement, rect: DOMRect) => {
        const fx = ((px - rect.left) / rect.width) * 100;
        const fy = ((py - rect.top) / rect.height) * 100;
        button.style.setProperty("--fx", `${fx.toFixed(1)}%`);
        button.style.setProperty("--fy", `${fy.toFixed(1)}%`);
      };

      const enter = (button: HTMLElement) => {
        active = button;
        bounds = button.getBoundingClientRect();
        setOrigin(button, bounds);
        // Commit the new origin before the fill starts growing, or the circle
        // would slide over from wherever the last hover ended.
        void button.offsetWidth;
        button.dataset.hot = "true";
        cursor.dataset.active = "true";
      };

      const leave = () => {
        if (!active) return;
        if (bounds) setOrigin(active, bounds);
        active.dataset.hot = "false";
        active = null;
        bounds = null;
        cursor.dataset.active = "false";
      };

      const tick = () => {
        frame = 0;
        let moving = false;

        if (visible) {
          if (!ringPlaced) {
            ring.x = px;
            ring.y = py;
            ringPlaced = true;
          }
          ring.x += (px - ring.x) * RING_FOLLOW;
          ring.y += (py - ring.y) * RING_FOLLOW;
          cursor.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`;
          if (Math.abs(px - ring.x) + Math.abs(py - ring.y) > 0.1) moving = true;
        }

        springs.forEach((entry, button) => {
          let tx = 0;
          let ty = 0;
          if (button === active && bounds) {
            const nx = (px - (bounds.left + bounds.width / 2)) / (bounds.width / 2);
            const ny = (py - (bounds.top + bounds.height / 2)) / (bounds.height / 2);
            tx = Math.max(-1, Math.min(1, nx)) * PULL_X;
            ty = Math.max(-1, Math.min(1, ny)) * PULL_Y;
          }
          const live = step(entry.spring, tx, ty);
          const { x, y } = entry.spring;
          if (entry.face)
            entry.face.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
          if (entry.icon)
            entry.icon.style.transform = `translate3d(${((x / PULL_X) * ICON_PULL).toFixed(2)}px, ${((y / PULL_Y) * ICON_PULL).toFixed(2)}px, 0)`;
          if (live || button === active) moving = true;
          else {
            if (entry.face) entry.face.style.transform = "";
            if (entry.icon) entry.icon.style.transform = "";
            springs.delete(button);
          }
        });

        if (moving) frame = requestAnimationFrame(tick);
      };
      const wake = () => {
        if (!frame) frame = requestAnimationFrame(tick);
      };

      const move = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") {
          hide();
          return;
        }
        px = event.clientX;
        py = event.clientY;
        if (!visible) {
          visible = true;
          cursor.dataset.visible = "true";
        }
        const next = (event.target as Element).closest<HTMLElement>(
          "[data-hero-magnetic]"
        );
        if (next !== active) {
          leave();
          if (next) {
            entryFor(next);
            enter(next);
          }
        }
        wake();
      };

      const hide = () => {
        visible = false;
        ringPlaced = false;
        cursor.dataset.visible = "false";
        leave();
        wake();
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
        cancelAnimationFrame(frame);
        frame = 0;
        springs.forEach(({ face, icon }) => {
          if (face) face.style.transform = "";
          if (icon) icon.style.transform = "";
        });
        springs.clear();
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
