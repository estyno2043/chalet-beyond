import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { EASE, DUR, SPRING_GESTURE } from "@/lib/motion";
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
function geometry(id: number) {
  const meta = manifest[String(id) as keyof typeof manifest];
  const ratio = meta.width / meta.height;
  const maxW = innerWidth - (innerWidth >= 768 ? 144 : 24);
  const maxH = innerHeight - (innerWidth >= 768 ? 200 : 220);
  const width = Math.min(maxW, maxH * ratio);
  const height = width / ratio;
  return {
    width,
    height,
    left: (innerWidth - width) / 2,
    top: (innerHeight - height) / 2 - 12,
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
  const [direction, setDirection] = useState(1);
  const [instant, setInstant] = useState(false);
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
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const backdrop = useTransform(y, [0, 300], [1, 0.15]);
  const navigate = useCallback(
    (delta: number, keyboard = false) => {
      setInstant(keyboard);
      setDirection(delta);
      setIndex(value => (value + delta + photos.length) % photos.length);
      x.set(0);
      y.set(0);
    },
    [photos.length, x, y]
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
        navigate(1, true);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        navigate(-1, true);
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
        <motion.div
          className="lightbox-drag"
          drag
          dragDirectionLock
          dragMomentum={false}
          dragElastic={1}
          style={{ x, y }}
          onDirectionLock={value => {
            axis.current = value;
          }}
          onDragStart={() => {
            axis.current = null;
          }}
          onDragEnd={(_, info) => {
            const horizontal =
              axis.current === "x" ||
              (axis.current === null &&
                Math.abs(info.offset.x) >= Math.abs(info.offset.y));
            if (
              horizontal &&
              (Math.abs(info.offset.x) >= 80 || Math.abs(info.velocity.x) > 110)
            )
              navigate(info.offset.x > 0 ? -1 : 1);
            else if (!horizontal && info.offset.y > 120) void close();
            else {
              animate(x, 0, SPRING_GESTURE);
              animate(y, 0, SPRING_GESTURE);
            }
          }}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.img
              key={photos[index]}
              src={sources[photos[index]] || photoUrl(photos[index], 1600)}
              alt={c.photoAlt[PHOTO_IDS.indexOf(photos[index])]}
              draggable={false}
              initial={{
                opacity: 0,
                x: reduce || instant ? 0 : `${direction * 4}%`,
                filter: reduce || instant ? "none" : "blur(2px)",
              }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{
                opacity: 0,
                transition: { duration: instant ? 0 : DUR.ui },
              }}
              transition={{ duration: instant ? 0 : DUR.state, ease: EASE.ui }}
            />
          </AnimatePresence>
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
                setInstant(false);
                setDirection(i > index ? 1 : -1);
                setIndex(i);
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
