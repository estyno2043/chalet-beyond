/*
 * Globe — Magic UI (magicui.design/r/globe), built on cobe. Canvas, drag
 * damping and spring as published; `motion/react` mapped to framer-motion.
 * Changes for the Okolie block:
 * - colours rewritten to Dark Timber (dark base, amber marker);
 * - instead of an endless spin the globe swings in once and rests on its
 *   marker with a slight sway, and springs back home after a drag;
 * - the WebGL loop pauses while the canvas is off-screen.
 * Callers lazy-load this module and show a static fallback for reduced
 * motion or missing WebGL.
 */
import { useEffect, useRef } from "react";
import createGlobe, { type COBEOptions } from "cobe";
import { useMotionValue, useSpring } from "framer-motion";

import { cn } from "@/lib/utils";

const MOVEMENT_DAMPING = 1400;
const INTRO_MS = 2400;
const INTRO_OFFSET = -1.4;

/** cobe [phi, theta] that bring a lat/lon to the front of the globe. */
function locationToAngles(lat: number, lon: number): [number, number] {
  return [
    Math.PI - ((lon * Math.PI) / 180 - Math.PI / 2),
    (lat * Math.PI) / 180,
  ];
}

export function Globe({
  className,
  location,
}: {
  className?: string;
  /** [lat, lon] marked in amber and kept at the centre. */
  location: [number, number];
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const widthRef = useRef(0);
  const pointerInteracting = useRef<number | null>(null);

  const r = useMotionValue(0);
  const rs = useSpring(r, {
    mass: 1,
    damping: 30,
    stiffness: 100,
  });

  const updatePointerInteraction = (value: number | null) => {
    pointerInteracting.current = value;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value !== null ? "grabbing" : "grab";
    }
    // Let go: the spring carries the globe back to the marker.
    if (value === null) r.set(0);
  };

  const updateMovement = (clientX: number) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current;
      r.set(r.get() + delta / MOVEMENT_DAMPING);
    }
  };

  const [lat, lon] = location;

  useEffect(() => {
    const canvas = canvasRef.current!;
    const onResize = () => {
      widthRef.current = canvas.offsetWidth;
    };
    window.addEventListener("resize", onResize);
    onResize();

    const [homePhi, homeTheta] = locationToAngles(lat, lon);
    const start = performance.now();

    const config: COBEOptions = {
      width: widthRef.current * 2,
      height: widthRef.current * 2,
      onRender: () => {},
      devicePixelRatio: 2,
      phi: homePhi + INTRO_OFFSET,
      theta: homeTheta,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 5,
      baseColor: [0.3, 0.27, 0.24],
      markerColor: [0.95, 0.5, 0.15],
      glowColor: [0.2, 0.16, 0.12],
      markers: [{ location: [lat, lon], size: 0.09 }],
    };

    const globe = createGlobe(canvas, {
      ...config,
      onRender: state => {
        const t = performance.now() - start;
        const p = Math.min(t / INTRO_MS, 1);
        const intro = INTRO_OFFSET * Math.pow(1 - p, 3);
        const sway = 0.08 * Math.sin(t / 2600);
        state.phi = homePhi + intro + sway + rs.get();
        state.width = widthRef.current * 2;
        state.height = widthRef.current * 2;
      },
    });

    // No WebGL work while the globe is out of view.
    const observer = new IntersectionObserver(([entry]) =>
      globe.toggle(entry.isIntersecting)
    );
    observer.observe(canvas);

    const reveal = setTimeout(() => (canvas.style.opacity = "1"), 0);
    return () => {
      clearTimeout(reveal);
      observer.disconnect();
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, [rs, lat, lon]);

  return (
    <div className={cn("relative aspect-square w-full", className)}>
      <canvas
        className="size-full cursor-grab opacity-0 transition-opacity duration-500 contain-[layout_paint_size]"
        ref={canvasRef}
        onPointerDown={e => updatePointerInteraction(e.clientX)}
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={e => updateMovement(e.clientX)}
        onTouchMove={e => e.touches[0] && updateMovement(e.touches[0].clientX)}
      />
    </div>
  );
}
