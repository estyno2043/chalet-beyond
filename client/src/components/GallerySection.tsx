import { lazy, Suspense, useRef, useState } from "react";
import { SectionHeader } from "./premium/SectionHeader";
import { RevealPhoto } from "./premium/Photo";
import { usePremiumCopy } from "./premium/copy";
const Lightbox = lazy(() => import("./premium/Lightbox"));
export const ALBUMS = [
  [2, 3, 38, 28],
  [43, 44, 46, 48, 65, 68, 70, 72],
  [54, 55, 60],
  [58, 31, 62, 63],
  [12, 38],
];
export function GallerySection() {
  const c = usePremiumCopy();
  const [active, setActive] = useState<number | null>(null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  return (
    <section id="priestory" className="premium-section gallery-section">
      <div className="container">
        <SectionHeader lines={c.gallery} description={c.galleryBody} />
        <div className="gallery-bento">
          {ALBUMS.map((photos, i) => (
            <button
              ref={node => {
                buttons.current[i] = node;
              }}
              className={`gallery-cover gallery-cover--${i}`}
              type="button"
              key={i}
              onPointerEnter={() => {
                void import("./premium/Lightbox");
              }}
              onFocus={() => {
                void import("./premium/Lightbox");
              }}
              onClick={() => setActive(i)}
              aria-haspopup="dialog"
              aria-label={`${c.albums[i]} — ${c.albumFacts[i]}`}
            >
              <RevealPhoto
                id={photos[0]}
                delay={(i % 3) * 60}
                sizes={
                  i === 0
                    ? "(min-width: 1024px) 45vw, 100vw"
                    : "(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw"
                }
              />
              <div className="gallery-cover__shade" />
              <div className="gallery-cover__caption">
                <h3>{c.albums[i]}</h3>
                <p>{c.albumFacts[i]}</p>
              </div>
              <span className="gallery-cover__open" aria-hidden="true">
                ↗
              </span>
            </button>
          ))}
        </div>
      </div>
      {active !== null && (
        <Suspense fallback={null}>
          <Lightbox
            photos={ALBUMS[active]}
            title={c.albums[active]}
            cover={buttons.current[active]!}
            onClose={() => setActive(null)}
          />
        </Suspense>
      )}
    </section>
  );
}
