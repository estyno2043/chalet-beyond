import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { usePremiumCopy } from "./premium/copy";
import { RollLink } from "./RollButton";

const Globe = lazy(() =>
  import("./ui/globe").then(module => ({ default: module.Globe }))
);

/** Veľká Lomnica — the globe's marker and centre. */
const LOMNICA: [number, number] = [49.12, 20.36];

function supportsWebGL() {
  try {
    const gl = document.createElement("canvas").getContext("webgl");
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    return Boolean(gl);
  } catch {
    return false;
  }
}

/** Still globe for reduced motion or no WebGL: outline, graticule, marker. */
function StaticGlobe() {
  return (
    <svg viewBox="0 0 200 200" className="location-map__static">
      <circle cx="100" cy="100" r="80" />
      <ellipse cx="100" cy="100" rx="40" ry="80" />
      <line x1="100" y1="20" x2="100" y2="180" />
      <ellipse cx="100" cy="100" rx="80" ry="28" />
      <line x1="20" y1="100" x2="180" y2="100" />
      <circle className="location-map__marker" cx="100" cy="100" r="4" />
    </svg>
  );
}

/** The map link with a globe on Veľká Lomnica, one block below Okolie. */
export function LocationMap() {
  const c = usePremiumCopy();
  const ref = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"idle" | "globe" | "static">("idle");

  // cobe and its WebGL loop load only when the block nears the viewport.
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        observer.disconnect();
        const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
        setMode(!reduce && supportsWebGL() ? "globe" : "static");
      },
      { rootMargin: "300px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="location-map">
      <div className="container location-map__inner">
        <div ref={ref} className="location-map__globe" aria-hidden="true">
          {mode === "globe" && (
            <Suspense fallback={null}>
              <Globe location={LOMNICA} />
            </Suspense>
          )}
          {mode === "static" && <StaticGlobe />}
        </div>
        <div className="location-map__copy">
          <p className="location-map__place">Veľká Lomnica</p>
          <p className="location-map__coords">49.12° N · 20.36° E</p>
          <RollLink
            href="https://www.google.com/maps/search/?api=1&query=Chalet+Beyond+Velka+Lomnica"
            target="_blank"
            rel="noopener noreferrer"
          >
            {c.map}
          </RollLink>
        </div>
      </div>
    </div>
  );
}
