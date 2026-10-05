import { useLayoutEffect, useRef, type ImgHTMLAttributes } from "react";
import manifest from "./photo-manifest.json";
import { usePremiumCopy, PHOTO_IDS } from "./copy";
import "./photo-reveal.css";

export const photoUrl = (id: number, width = 1600, format = "avif") =>
  `/photos/lomnica-${String(id).padStart(2, "0")}-${width}-v1.${format}`;
export function Photo({
  id,
  sizes = "100vw",
  className = "",
  eager = false,
  ...props
}: { id: number; sizes?: string; className?: string; eager?: boolean } & Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "id"
>) {
  const c = usePremiumCopy();
  const meta = manifest[String(id) as keyof typeof manifest];
  const srcSet = (format: string) =>
    [640, 1024, 1600, 2400]
      .map(width => `${photoUrl(id, width, format)} ${width}w`)
      .join(", ");
  return (
    <picture className={`property-photo ${className}`}>
      <source type="image/avif" srcSet={srcSet("avif")} sizes={sizes} />
      <img
        {...props}
        src={photoUrl(id, 1024, "webp")}
        srcSet={srcSet("webp")}
        sizes={sizes}
        width={meta.width}
        height={meta.height}
        alt={props.alt ?? c.photoAlt[PHOTO_IDS.indexOf(id)]}
        loading={eager ? "eager" : "lazy"}
        fetchPriority="low"
        decoding="async"
      />
    </picture>
  );
}
/** Images reveal at their midpoint once decoded; hover belongs to another wrapper. */
export function RevealPhoto({
  id,
  className = "",
  eager = false,
  sizes,
  children,
}: {
  id: number;
  className?: string;
  eager?: boolean;
  sizes?: string;
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const node = ref.current;
    const img = node?.querySelector("img");
    const midpointMarker = node?.querySelector<HTMLElement>(
      ".photo-reveal__midpoint"
    );
    if (
      !node ||
      !img ||
      !midpointMarker ||
      typeof IntersectionObserver === "undefined"
    )
      return;

    // Never hide a photo that was already visible when this component mounted.
    // Without JS (or on a late mount), the image remains visible by default.
    if (node.getBoundingClientRect().top < window.innerHeight) return;

    node.dataset.photoReveal = "pending";
    let decoded = false;
    let decoding = false;
    let started = false;
    let alive = true;
    let finishTimer: number | undefined;
    let trigger: IntersectionObserver | undefined;

    const reveal = () => {
      if (started) return;
      started = true;
      prewarm.disconnect();
      trigger?.disconnect();
      window.removeEventListener("resize", refreshTrigger);
      if (!decoded) {
        // A slow request must never hide an image later when decode resolves.
        node.dataset.photoReveal = "done";
        return;
      }
      node.dataset.photoReveal = "revealing";
      finishTimer = window.setTimeout(() => {
        node.dataset.photoReveal = "done";
      }, 820);
    };

    const refreshTrigger = () => {
      if (started) return;
      trigger?.disconnect();
      // IntersectionObserver percentage margins resolve against root width,
      // so use pixels to put the line at 75% of the viewport height.
      const bottomInset = Math.round(window.innerHeight * 0.25);
      trigger = new IntersectionObserver(
        entries => {
          if (started) return;
          if (
            entries.some(
              entry => entry.target === midpointMarker && entry.isIntersecting
            )
          ) {
            reveal();
            return;
          }
          // A single fast scroll can jump the marker past the observer root.
          // The card entry covers that case without polling during scroll.
          if (
            entries.some(entry => entry.target === node && entry.isIntersecting)
          ) {
            const bounds = node.getBoundingClientRect();
            if (bounds.top + bounds.height / 2 <= window.innerHeight * 0.75)
              reveal();
          }
        },
        { rootMargin: `0px 0px -${bottomInset}px 0px` }
      );
      trigger.observe(node);
      trigger.observe(midpointMarker);
    };

    const decode = () => {
      if (decoding) return;
      decoding = true;
      // Keep native lazy loading until the card is close, then request and
      // decode the selected AVIF/WebP source before the midpoint arrives.
      if (!eager) img.loading = "eager";
      if (typeof img.decode !== "function") return;
      void img.decode().then(
        () => {
          if (alive) decoded = true;
        },
        () => {
          // A failed decode leaves the ordinary image loading path intact.
        }
      );
    };

    const prewarm = new IntersectionObserver(
      entries => {
        if (started || !entries.some(entry => entry.isIntersecting)) return;
        prewarm.disconnect();
        decode();
      },
      { rootMargin: "800px 0px" }
    );
    prewarm.observe(node);
    refreshTrigger();
    window.addEventListener("resize", refreshTrigger);
    if (eager) decode();

    return () => {
      alive = false;
      prewarm.disconnect();
      trigger?.disconnect();
      window.removeEventListener("resize", refreshTrigger);
      window.clearTimeout(finishTimer);
      delete node.dataset.photoReveal;
    };
  }, [id, eager]);
  return (
    <div ref={ref} className={`photo-reveal ${className}`}>
      <div className="photo-reveal__scale">
        <Photo id={id} eager={eager} sizes={sizes} />
      </div>
      <span className="photo-reveal__midpoint" aria-hidden="true" />
      {children}
    </div>
  );
}
