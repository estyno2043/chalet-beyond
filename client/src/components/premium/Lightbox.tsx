import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal, flushSync } from "react-dom";
import {
  animate,
  motion,
  useDragControls,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { EASE, DUR, SPRING_GESTURE, SPRING_PAGE } from "@/lib/motion";
import { photoUrl } from "./Photo";
import manifest from "./photo-manifest.json";
import { PHOTO_IDS, usePremiumCopy } from "./copy";
import { RollButton } from "../RollButton";

type Props = {
  photos: number[];
  title: string;
  cover: HTMLButtonElement;
  onClose: () => void;
};
// Mirrors premium.css: rows sit max(24px, safe-area) from the edge; the header
// and the arrow row are 44px, the thumbnail strip 52px, rows 16px apart.
const EDGE = 24;
const CONTROL = 44;
const THUMBNAILS = 52;
const GAP = 16;
// Swipe paging: neighbours wait one viewport (plus a gap) to either side.
const PAGE_GAP = 16;
const SWIPE_DISTANCE = 80;
const SWIPE_VELOCITY = 300;
const pageWidth = () => innerWidth + PAGE_GAP;
function safeArea() {
  const probe = document.createElement("div");
  probe.style.cssText =
    "position:fixed;visibility:hidden;padding:env(safe-area-inset-top) 0 env(safe-area-inset-bottom)";
  document.body.append(probe);
  const style = getComputedStyle(probe);
  const insets = {
    top: parseFloat(style.paddingTop) || 0,
    bottom: parseFloat(style.paddingBottom) || 0,
  };
  probe.remove();
  return insets;
}
/** The photo fills the band between the header and the controls below it. */
function geometry(id: number) {
  const meta = manifest[String(id) as keyof typeof manifest];
  const ratio = meta.width / meta.height;
  const safe = safeArea();
  const above = Math.max(EDGE, safe.top) + CONTROL + GAP;
  const below = Math.max(EDGE, safe.bottom) + THUMBNAILS + GAP + CONTROL + GAP;
  const maxW = innerWidth - (innerWidth >= 768 ? 144 : 24);
  const maxH = innerHeight - above - below;
  const width = Math.min(maxW, maxH * ratio);
  const height = width / ratio;
  return {
    width,
    height,
    left: (innerWidth - width) / 2,
    top: above + (maxH - height) / 2,
  };
}
function fromCover(cover: HTMLButtonElement, box: ReturnType<typeof geometry>) {
  const rect = cover.getBoundingClientRect();
  const scale = Math.max(rect.width / box.width, rect.height / box.height);
  const ix = Math.max(0, (1 - rect.width / (box.width * scale)) * 50);
  const iy = Math.max(0, (1 - rect.height / (box.height * scale)) * 50);
  return {
    transform: `translate(${rect.left + rect.width / 2 - (box.left + box.width / 2)}px, ${rect.top + rect.height / 2 - (box.top + box.height / 2)}px) scale(${scale})`,
    clipPath: `inset(${iy}% ${ix}% ${iy}% ${ix}% round 3px)`,
  };
}
const resting = {
  transform: "translate(0px, 0px) scale(1)",
  clipPath: "inset(0% 0% 0% 0% round 3px)",
};
export default function Lightbox({ photos, title, cover, onClose }: Props) {
  const c = usePremiumCopy();
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  indexRef.current = index;
  const [box, setBox] = useState(() => geometry(photos[0]));
  const [sources, setSources] = useState<Record<number, string>>(() => ({
    [photos[0]]:
      cover.querySelector("img")?.currentSrc || photoUrl(photos[0], 1024),
  }));
  const [closing, setClosing] = useState(false);
  const dialog = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<(immediate?: boolean) => void>(() => {});
  const closingRef = useRef(false);
  const axis = useRef<"x" | "y" | null>(null);
  const multiTouch = useRef(false);
  const pressedAt = useRef(0);
  const layer = useRef<HTMLDivElement>(null);
  const slides = useRef(new Map<number, HTMLImageElement>());
  const dragControls = useDragControls();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const backdrop = useTransform(y, [0, 300], [1, 0.15]);
  const wrap = useCallback(
    (i: number) => (i + photos.length) % photos.length,
    [photos.length]
  );
  // With two photos the single neighbour sits on whichever side is revealed.
  const side = (offset: number) =>
    photos.length === 2 ? (x.get() > 0 ? -1 : 1) : offset;
  useMotionValueEvent(x, "change", value => {
    if (photos.length !== 2) return;
    const node = slides.current.get(photos[wrap(indexRef.current + 1)]);
    if (node)
      node.style.transform = `translateX(${(value > 0 ? -1 : 1) * pageWidth()}px)`;
  });
  /** Motion values paint on the next frame; write now so a photo swap and its offset share one paint. */
  const place = useCallback(
    (value: number) => {
      x.jump(value);
      if (layer.current)
        layer.current.style.transform = value
          ? `translateX(${value}px)`
          : "none";
    },
    [x]
  );
  /**
   * Arrows, keyboard and thumbnails cross-fade with a short slide from the
   * travel side. A swipe passes its release velocity instead: the photos keep
   * their place under the finger and one spring carries them on.
   */
  const show = useCallback(
    (next: number, direction: number, velocity?: number) => {
      const from = x.get();
      const outgoing = slides.current.get(photos[indexRef.current]);
      slides.current.forEach(node =>
        node.getAnimations().forEach(animation => animation.cancel())
      );
      flushSync(() => {
        setIndex(next);
        setBox(geometry(photos[next]));
      });
      indexRef.current = next;
      if (velocity !== undefined) {
        place(from + direction * pageWidth());
        animate(x, 0, { ...SPRING_PAGE, velocity });
        return;
      }
      place(0);
      y.jump(0);
      const incoming = slides.current.get(photos[next]);
      const timing = {
        duration: DUR.state * 1000,
        easing: `cubic-bezier(${EASE.ui})`,
      };
      if (outgoing?.isConnected && outgoing !== incoming)
        outgoing.animate(
          [
            { transform: "none", opacity: 1 },
            { transform: "none", opacity: 0 },
          ],
          { ...timing, duration: DUR.ui * 1000 }
        );
      incoming?.animate(
        reduce
          ? [{ opacity: 0 }, { opacity: 1 }]
          : [
              {
                opacity: 0,
                transform: `translateX(${direction * 4}%)`,
                filter: "blur(2px)",
              },
              { opacity: 1, transform: "none", filter: "blur(0px)" },
            ],
        timing
      );
    },
    [photos, place, reduce, x, y]
  );
  const navigate = useCallback(
    (delta: number) => show(wrap(indexRef.current + delta), delta),
    [show, wrap]
  );
  const close = useCallback(
    async (immediate = false) => {
      if (closingRef.current) return;
      closingRef.current = true;
      setClosing(true);
      const rect = cover.getBoundingClientRect();
      const visible =
        rect.bottom > 80 &&
        rect.top < innerHeight &&
        rect.right > 0 &&
        rect.left < innerWidth;
      if (!immediate && stage.current) {
        const target =
          !reduce && visible
            ? fromCover(cover, box)
            : { opacity: 0, transform: reduce ? "none" : "scale(.98)" };
        try {
          await stage.current.animate([resting, target], {
            duration: reduce ? 240 : visible ? 240 : 160,
            easing: `cubic-bezier(${EASE.ui})`,
            fill: "forwards",
          }).finished;
        } catch {
          /* interrupted by unmount */
        }
      }
      onClose();
    },
    [box, cover, index, onClose, reduce]
  );
  closeRef.current = close;
  useEffect(() => {
    const htmlOverflow = document.documentElement.style.overflow;
    const bodyOverflow = document.body.style.overflow;
    const htmlPadding = document.documentElement.style.paddingRight;
    const gap = innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    if (gap > 0) document.documentElement.style.paddingRight = `${gap}px`;
    document.documentElement.dataset.galleryOpen = "true";
    closeButton.current?.focus({ preventScroll: true });
    const node = stage.current;
    const animation = node?.animate(
      reduce
        ? [{ opacity: 0 }, { opacity: 1 }]
        : [fromCover(cover, geometry(photos[0])), resting],
      {
        duration: (reduce ? DUR.state : DUR.modal) * 1000,
        easing: `cubic-bezier(${EASE.drawer})`,
        fill: "backwards",
      }
    );
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        void closeRef.current(true);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        navigate(1);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        navigate(-1);
      }
      if (event.key === "Tab") {
        const focusable = dialog.current?.querySelectorAll<HTMLElement>(
          'button:not(:disabled), [href], [tabindex="0"]'
        );
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (
          event.shiftKey &&
          (document.activeElement === first ||
            !dialog.current?.contains(document.activeElement))
        ) {
          event.preventDefault();
          last.focus();
        } else if (
          !event.shiftKey &&
          (document.activeElement === last ||
            !dialog.current?.contains(document.activeElement))
        ) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    const resize = () =>
      setBox(geometry(photos[Number(dialog.current?.dataset.index ?? 0)]));
    window.addEventListener("keydown", key);
    window.addEventListener("resize", resize);
    return () => {
      animation?.cancel();
      window.removeEventListener("keydown", key);
      window.removeEventListener("resize", resize);
      document.documentElement.style.overflow = htmlOverflow;
      document.body.style.overflow = bodyOverflow;
      document.documentElement.style.paddingRight = htmlPadding;
      delete document.documentElement.dataset.galleryOpen;
      cover.focus({ preventScroll: true });
    };
    // Scroll lock and initial FLIP are owned by the lifetime of this modal.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    setBox(geometry(photos[index]));
    let alive = true;
    const id = photos[index];
    const image = new Image();
    image.src = photoUrl(id, innerWidth > 1600 ? 2400 : 1600);
    image
      .decode()
      .then(async () => {
        if (index === 0) await new Promise(resolve => setTimeout(resolve, 420));
        if (alive) setSources(previous => ({ ...previous, [id]: image.src }));
      })
      .catch(() => {
        /* keep downloaded cover */
      });
    for (const offset of [-1, 1]) {
      const adjacent = new Image();
      adjacent.src = photoUrl(
        photos[(index + offset + photos.length) % photos.length],
        1600
      );
    }
    return () => {
      alive = false;
    };
  }, [index, photos]);
  // Current photo last, so it paints above a photo fading out.
  const slots = useMemo(() => {
    const list: { id: number; offset: number; b: typeof box }[] = [];
    for (const offset of photos.length > 2 ? [-1, 1, 0] : [1, 0]) {
      if (offset && photos.length < 2) continue;
      const id = photos[wrap(index + offset)];
      list.push({ id, offset, b: offset ? geometry(id) : box });
    }
    return list;
  }, [box, index, photos, wrap]);
  const controls = {
    initial: { opacity: 0 },
    animate: { opacity: closing ? 0 : 1 },
    transition: { duration: DUR.state, delay: closing || reduce ? 0 : 0.18 },
  };
  return createPortal(
    <div
      ref={dialog}
      data-index={index}
      role="dialog"
      aria-modal="true"
      aria-labelledby="gallery-title"
      className="lightbox"
    >
      <motion.div
        className="lightbox-backdrop"
        style={{ opacity: backdrop }}
        initial={{ backgroundColor: "rgb(4 4 4 / 0)" }}
        animate={{
          backgroundColor: closing ? "rgb(4 4 4 / 0)" : "rgb(4 4 4 / .96)",
        }}
        transition={{ duration: DUR.state }}
        onClick={() => {
          void close();
        }}
      />
      <motion.div className="lightbox-top" {...controls}>
        <h2 id="gallery-title">{title}</h2>
        <RollButton
          size="sm"
          onClick={() => {
            void close();
          }}
          aria-label={c.close}
          className="lightbox-close"
        >
          <span
            ref={node => {
              closeButton.current = node?.closest("button") ?? null;
            }}
          >
            <X size={18} aria-hidden="true" />
          </span>
        </RollButton>
      </motion.div>
      <div ref={stage} className="lightbox-stage" style={box}>
        {/* Pinch stays with the browser (touch-action in CSS); one finger
            drags, locked to its first axis: sideways pages, down closes. */}
        <motion.div
          ref={layer}
          className="lightbox-drag"
          drag
          dragListener={false}
          dragControls={dragControls}
          dragDirectionLock
          dragMomentum={false}
          dragElastic={1}
          style={{ x, y }}
          onPointerDown={event => {
            multiTouch.current = !event.isPrimary;
            pressedAt.current = performance.now();
            if (event.isPrimary) dragControls.start(event);
          }}
          onDirectionLock={value => {
            axis.current = value;
          }}
          onDragStart={() => {
            axis.current = null;
            slides.current.forEach(node =>
              node.getAnimations().forEach(animation => animation.finish())
            );
          }}
          onDragEnd={(event, info) => {
            const horizontal =
              axis.current === "x" ||
              (axis.current === null &&
                Math.abs(info.offset.x) >= Math.abs(info.offset.y));
            // A pinch or system gesture cancels the drag; never page on it.
            const cancelled =
              event.type === "pointercancel" || multiTouch.current;
            if (!cancelled && horizontal && photos.length > 1) {
              const position = x.get();
              // A flick that starts at rest is timed by Motion from a stale
              // frame and reads slow; short gestures use their average speed.
              const elapsed = (performance.now() - pressedAt.current) / 1000;
              const velocity =
                elapsed < 0.2
                  ? info.offset.x / Math.max(elapsed, 0.016)
                  : info.velocity.x;
              // The neighbour being revealed: +1 next (from the right), -1 previous.
              const direction =
                position < 0 || (position === 0 && velocity < 0) ? 1 : -1;
              const flick = Math.abs(velocity) > SWIPE_VELOCITY;
              const commit = flick
                ? Math.sign(velocity) === -direction
                : Math.abs(position) > pageWidth() / 2 ||
                  (Math.abs(info.offset.x) > SWIPE_DISTANCE &&
                    Math.sign(info.offset.x) === -direction);
              if (commit) {
                show(wrap(index + direction), direction, velocity);
                return;
              }
            } else if (!cancelled && !horizontal && info.offset.y > 120) {
              void close();
              return;
            }
            animate(x, 0, { ...SPRING_GESTURE, velocity: info.velocity.x });
            animate(y, 0, SPRING_GESTURE);
          }}
        >
          {slots.map(({ id, offset, b }) => (
            <img
              key={id}
              ref={node => {
                if (!node) return;
                slides.current.set(id, node);
                return () => {
                  if (slides.current.get(id) === node)
                    slides.current.delete(id);
                };
              }}
              src={sources[id] || photoUrl(id, 1600)}
              alt={offset ? "" : c.photoAlt[PHOTO_IDS.indexOf(id)]}
              aria-hidden={offset ? true : undefined}
              draggable={false}
              style={{
                left: b.left - box.left,
                top: b.top - box.top,
                width: b.width,
                height: b.height,
                transform: offset
                  ? `translateX(${side(offset) * pageWidth()}px)`
                  : "none",
              }}
            />
          ))}
        </motion.div>
      </div>
      <motion.div className="lightbox-bottom" {...controls}>
        <div className="lightbox-navigation">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label={c.previous}
          >
            <ChevronLeft aria-hidden="true" />
          </button>
          <p aria-live="polite">
            {c.photo} {index + 1} / {photos.length}
          </p>
          <button type="button" onClick={() => navigate(1)} aria-label={c.next}>
            <ChevronRight aria-hidden="true" />
          </button>
        </div>
        <div className="lightbox-thumbnails">
          {photos.map((id, i) => (
            <button
              type="button"
              key={id}
              aria-label={`${c.photo} ${i + 1}`}
              aria-current={index === i ? "true" : undefined}
              onClick={() => {
                if (i !== index) show(i, i > index ? 1 : -1);
              }}
            >
              <img
                src={photoUrl(id, 640)}
                width="72"
                height="48"
                alt=""
                loading="lazy"
                decoding="async"
              />
            </button>
          ))}
        </div>
      </motion.div>
    </div>,
    document.body
  );
}
