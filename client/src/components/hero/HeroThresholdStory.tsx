/*
 * CHALET BEYOND — desktop hero, "Threshold Story".
 *
 * Three scenes told over 240svh of scroll: the landscape, the threshold
 * opening, the refuge inside. Replaces the scroll-scrubbed video hero.
 *
 * Why photographs and not video: the old hero wrote video.currentTime from an
 * endless requestAnimationFrame loop, so the browser re-seeked compressed video
 * on every frame of every scroll. That is the stutter. It also never stopped —
 * the component never unmounts, so the loop kept running while the guest was
 * down at the booking form. Stills driven by transform, opacity and clip-path
 * remove the cause rather than tuning the symptom, and cost 312 KB for all
 * three against 20 MB of chapter video.
 *
 * The scene is held by CSS position: sticky, not by ScrollTrigger's pin.
 * Both mechanisms do the same job and would fight over the same element;
 * sticky needs no pin-spacer and cannot leave the layout shifted behind it.
 * ScrollTrigger is used only to drive progress.
 */
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HeroActions } from "@/components/hero/HeroActions";
import { useT } from "@/i18n/LanguageProvider";

gsap.registerPlugin(ScrollTrigger);

const SCENES = [
  { src: "/gallery/booking/856619975.jpg", kind: "full" as const },
  { src: "/gallery/booking/856619250.jpg", kind: "threshold" as const },
  { src: "/gallery/booking/846907929.jpg", kind: "framed" as const },
];

/** Scroll length. 240svh total, of which 100svh is the sticky scene itself. */
const TOTAL_SVH = 240;

export function HeroThresholdStory() {
  const t = useT();
  const rootRef = useRef<HTMLDivElement>(null);
  const sceneRefs = useRef<(HTMLDivElement | null)[]>([]);
  const captionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const thresholdRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduced) return;

    // gsap.context scopes every tween and trigger created inside it, so revert()
    // takes the inline styles back off on unmount or breakpoint change. Without
    // it GSAP's last computed transform stays on the element and the reduced
    // motion or mobile layout inherits a frozen frame.
    const ctx = gsap.context(() => {
      const scenes = sceneRefs.current;
      const captions = captionRefs.current;
      if (scenes.length < 3 || captions.length < 3) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          onUpdate: (self) => {
            const index = Math.min(2, Math.floor(self.progress * 3));
            if (progressRef.current) {
              progressRef.current.textContent = `0${index + 1}`;
            }
            if (barRef.current) {
              barRef.current.style.transform = `scaleX(${self.progress})`;
            }
          },
        },
      });

      // Scene 1 hands over to 2, then 2 to 3. Opacity and scale only: both are
      // compositor properties, so the browser never re-lays-out mid-scroll.
      tl.to(scenes[0], { opacity: 0, scale: 1.06, ease: "none" }, 0)
        .fromTo(scenes[1], { opacity: 0 }, { opacity: 1, ease: "none" }, 0)
        // The threshold widens from a slot to an opening — a door giving way,
        // not a camera pushing in. clip-path animates without touching layout.
        .fromTo(
          thresholdRef.current,
          { clipPath: "inset(0% 33% 0% 33%)" },
          { clipPath: "inset(0% 22% 0% 22%)", ease: "none" },
          0,
        )
        .to(scenes[1], { opacity: 0, ease: "none" }, 0.5)
        .fromTo(scenes[2], { opacity: 0 }, { opacity: 1, ease: "none" }, 0.5);

      // Captions ride the same clock as the pictures they belong to.
      tl.to(captions[0], { opacity: 0, ease: "none" }, 0)
        .fromTo(captions[1], { opacity: 0 }, { opacity: 1, ease: "none" }, 0)
        .to(captions[1], { opacity: 0, ease: "none" }, 0.5)
        .fromTo(captions[2], { opacity: 0 }, { opacity: 1, ease: "none" }, 0.5);
    }, rootRef);

    return () => ctx.revert();
  }, [reduced]);

  const caption = (index: number) => (
    <div className="flex flex-col items-center text-center px-6">
      <h1
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
          lineHeight: 1,
          letterSpacing: "0.02em",
          color: "oklch(0.95 0.008 75)",
          textShadow: "0 2px 12px rgba(0,0,0,0.7), 0 8px 40px rgba(0,0,0,0.55)",
        }}
      >
        {t.hero.chapters[index].title}
      </h1>
      <p
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.72rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "oklch(0.82 0.015 75)",
          marginTop: "0.9rem",
          textShadow: "0 1px 10px rgba(0,0,0,0.8)",
        }}
      >
        {t.hero.chapters[index].subtitle}
      </p>
    </div>
  );

  // Reduced motion: no pin, no scrub. The first scene stands on its own and the
  // other two become ordinary blocks underneath, so nothing is only reachable
  // by scrolling through an animation.
  if (reduced) {
    return (
      <div id="hero">
        <section
          className="relative flex flex-col items-center justify-center"
          style={{ height: "100svh", background: "oklch(0.06 0.008 55)" }}
        >
          <img
            src={SCENES[0].src}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, oklch(0.04 0.008 55 / 0.5) 0%, transparent 30%, oklch(0.04 0.008 55 / 0.85) 100%)",
            }}
          />
          <div className="relative flex flex-col items-center gap-8">
            {caption(0)}
            <HeroActions />
          </div>
        </section>
        {SCENES.slice(1).map((scene, i) => (
          <section key={scene.src} className="relative" style={{ height: "70svh" }}>
            <img
              src={scene.src}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: "oklch(0.04 0.008 55 / 0.55)" }}
            >
              {caption(i + 1)}
            </div>
          </section>
        ))}
      </div>
    );
  }

  return (
    <div
      id="hero"
      ref={rootRef}
      style={{ height: `${TOTAL_SVH}svh`, background: "oklch(0.06 0.008 55)" }}
    >
      <div
        className="sticky top-0 overflow-hidden"
        style={{ height: "100svh" }}
      >
        {SCENES.map((scene, i) => (
          <div
            key={scene.src}
            ref={(el) => {
              sceneRefs.current[i] = el;
            }}
            className="absolute inset-0"
            style={{ opacity: i === 0 ? 1 : 0, willChange: "opacity, transform" }}
          >
            {scene.kind === "threshold" ? (
              <>
                <div
                  className="absolute inset-0"
                  style={{ background: "oklch(0.05 0.008 55)" }}
                />
                <div
                  ref={thresholdRef}
                  className="absolute inset-0"
                  style={{
                    clipPath: "inset(0% 33% 0% 33%)",
                    willChange: "clip-path",
                  }}
                >
                  <img
                    src={scene.src}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
              </>
            ) : (
              <img
                src={scene.src}
                alt=""
                className="h-full w-full object-cover"
              />
            )}
          </div>
        ))}

        {/* Legibility and, on the last scene, the amber that carries into the
            section below — the hero hands over instead of stopping. */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, oklch(0.04 0.008 55 / 0.55) 0%, transparent 32%, transparent 52%, oklch(0.04 0.008 55 / 0.88) 100%)",
          }}
        />

        {/* Captions stack in place; only the active one is opaque, driven by the
            same timeline through the parent scene's opacity. */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-10">
          <div className="relative" style={{ minHeight: "9rem" }}>
            {SCENES.map((scene, i) => (
              <div
                key={scene.src}
                ref={(el) => {
                  captionRefs.current[i] = el;
                }}
                className="absolute inset-0 flex items-center justify-center"
                style={{ opacity: i === 0 ? 1 : 0 }}
              >
                {caption(i)}
              </div>
            ))}
          </div>
        </div>

        {/* The action never leaves. A guest ready at scene one should not have
            to scroll through two more to find the button. */}
        <div className="absolute inset-x-0 bottom-14 flex justify-center px-6">
          <HeroActions />
        </div>

        {/* Textual progress, not dots: "01 / 03" says how much story is left. */}
        <div
          className="absolute left-8 top-1/2 flex items-center gap-3"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.68rem",
            letterSpacing: "0.2em",
            color: "oklch(0.78 0.015 75)",
          }}
        >
          <span ref={progressRef}>01</span>
          <span
            aria-hidden="true"
            style={{
              display: "block",
              width: "4rem",
              height: "1px",
              background: "oklch(0.72 0.12 65 / 0.25)",
            }}
          >
            <span
              ref={barRef}
              style={{
                display: "block",
                height: "100%",
                background: "oklch(0.72 0.12 65)",
                transform: "scaleX(0)",
                transformOrigin: "left",
              }}
            />
          </span>
          <span style={{ opacity: 0.5 }}>/ 03</span>
        </div>
      </div>
    </div>
  );
}
