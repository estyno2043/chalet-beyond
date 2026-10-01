import { useEffect, useRef, type ImgHTMLAttributes } from "react";
import manifest from "./photo-manifest.json";
import { usePremiumCopy, PHOTO_IDS } from "./copy";

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
        decoding="async"
      />
    </picture>
  );
}
/** Each image reveals only after decoding; hover belongs to another wrapper. */
export function RevealPhoto({
  id,
  className = "",
  delay = 0,
  eager = false,
  sizes,
  children,
}: {
  id: number;
  className?: string;
  delay?: number;
  eager?: boolean;
  sizes?: string;
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node || !node.animate) return;
    let alive = true;
    const observer = new IntersectionObserver(
      async entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        observer.disconnect();
        const img = node.querySelector("img");
        try {
          await img?.decode();
        } catch {
          return;
        }
        if (!alive) return;
        const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
        const wait =
          !reduce && matchMedia("(min-width: 768px)").matches
            ? Math.min(delay, 240)
            : 0;
        node.animate(
          reduce
            ? [{ opacity: 0 }, { opacity: 1 }]
            : [{ clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0)" }],
          {
            duration: reduce ? 240 : 1000,
            delay: wait,
            easing: "cubic-bezier(.77,0,.175,1)",
            fill: "backwards",
          }
        );
        if (!reduce)
          node
            .querySelector(".photo-reveal__scale")
            ?.animate(
              [{ transform: "scale(1.08)" }, { transform: "scale(1)" }],
              {
                duration: 1000,
                delay: wait,
                easing: "cubic-bezier(.77,0,.175,1)",
                fill: "backwards",
              }
            );
      },
      { rootMargin: "-100px 0px" }
    );
    observer.observe(node);
    return () => {
      alive = false;
      observer.disconnect();
    };
  }, [id, delay]);
  return (
    <div ref={ref} className={`photo-reveal ${className}`}>
      <div className="photo-reveal__scale">
        <Photo id={id} eager={eager} sizes={sizes} />
      </div>
      {children}
    </div>
  );
}
