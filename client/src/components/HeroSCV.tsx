/*
 * CHALET BEYOND — HeroSCV (Scroll-Controlled Video Hero)
 * ----------------------------------------------------------------------------
 * Three chapters, each scrubbed by scroll. Smoothness:
 *   - one continuous rAF loop (not seek-on-scroll)
 *   - currentTime is LERPED toward the scroll target so short clips glide
 *     instead of freezing/jumping between sparse keyframes
 *
 *   Chapter 1  golf fairway → gap
 *   Chapter 2  gap → chalet
 *   Chapter 3  summer chalet → winter night
 *   Brand zone last ch3 frame freezes; "CHALET BEYOND" reveal (Task 1)
 *
 * Page-load intro + end-of-ch3 reveal both use the SAME technique (BrandReveal).
 */
import { useEffect, useRef, useState } from "react";
import { BrandReveal } from "@/components/BrandReveal";

interface Chapter {
  src: string;
  title: string;
  subtitle: string;
}

// ── Chapter copy (Task 2) ────────────────────────────────────────────────────
const CHAPTERS: Chapter[] = [
  {
    src: "/videos/chapter1.mp4",
    title: "GOLFOVÉ IHRISKO BLACK STORK",
    subtitle: "úder, ktorý všetko začal",
  },
  {
    src: "/videos/chapter2.mp4",
    title: "ZA KAŽDÝM HORIZONTOM",
    subtitle: "27 jamiek · jediné PGA ihrisko na Slovensku",
  },
  {
    src: "/videos/chapter3.mp4",
    title: "VAŠE SÚKROMNÉ ÚTOČISKO",
    subtitle: "štyri ročné obdobia · jedna adresa",
  },
];

// Coordinates of the chalet / Black Stork resort, Veľká Lomnica.
const COORDS = "49°08'N 20°20'E — VEĽKÁ LOMNICA";

/** Viewport-heights of scroll each chapter consumes. Tighter = clip advances
 *  faster per pixel, so short videos never sit frozen. */
const SCROLL_PER_CHAPTER_VH = 110;
/** Extra scroll (~1 viewport) held on the frozen ch3 frame for the brand reveal. */
const BRAND_REVEAL_VH = 90;
/** Point inside chapter 3 (0–1) where the brand reveal fires + video freezes. */
const BRAND_TRIGGER = 0.88;

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

interface HeroState {
  chapter: number;
  showIntro: boolean;
  textVisible: boolean;
  brandRevealed: boolean;
}

export function HeroSCV() {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);
  const scrollYRef = useRef(0);
  const stateRef = useRef<HeroState>({
    chapter: 0,
    showIntro: true,
    textVisible: false,
    brandRevealed: false,
  });
  const [state, setState] = useState<HeroState>(stateRef.current);

  useEffect(() => {
    const onScroll = () => {
      scrollYRef.current = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    scrollYRef.current = window.scrollY;

    const lastIdx = CHAPTERS.length - 1;

    const tick = () => {
      const scrollY = scrollYRef.current;
      const vh = window.innerHeight;
      const pxPerChapter = (SCROLL_PER_CHAPTER_VH / 100) * vh;

      const ch3Local = clamp01((scrollY - pxPerChapter * lastIdx) / pxPerChapter);
      const freeze = ch3Local >= BRAND_TRIGGER;

      // Only scrub the VISIBLE chapter (others are opacity:0) — cuts decode
      // load ~3x. Gate on the native `video.seeking` flag so we never queue a
      // second seek while one is still decoding (the main source of stutter).
      const activeIdx = freeze
        ? lastIdx
        : Math.min(lastIdx, Math.max(0, Math.floor(scrollY / pxPerChapter)));
      const av = videoRefs.current[activeIdx];
      if (av && av.duration) {
        const clamped = clamp01((scrollY - pxPerChapter * activeIdx) / pxPerChapter);
        const target =
          activeIdx === lastIdx && freeze
            ? Math.max(0, av.duration - 0.04)
            : clamped * av.duration;
        // ~1 frame @30fps threshold; skip if a seek is already in flight.
        if (!av.seeking && Math.abs(av.currentTime - target) > 0.033) {
          av.currentTime = target;
        }
      }

      // Derive overlay state; only re-render when it actually changes.
      const cur = Math.min(lastIdx, Math.floor(scrollY / pxPerChapter));
      const localProgress = clamp01((scrollY - cur * pxPerChapter) / pxPerChapter);
      const showIntro = cur === 0 && localProgress < 0.05 && !freeze;
      const next: HeroState = {
        chapter: cur,
        showIntro,
        textVisible: localProgress < 0.82 && !freeze && !showIntro,
        brandRevealed: freeze,
      };
      const prev = stateRef.current;
      if (
        next.chapter !== prev.chapter ||
        next.showIntro !== prev.showIntro ||
        next.textVisible !== prev.textVisible ||
        next.brandRevealed !== prev.brandRevealed
      ) {
        stateRef.current = next;
        setState(next);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const { chapter, showIntro, textVisible, brandRevealed } = state;

  // parent height = pinned scroll distance + sticky height (100vh). Pinned
  // distance = chapter scrub + brand hold, so the frozen ch3 frame + brand
  // reveal stay pinned through the whole hold.
  const totalHeight = `${CHAPTERS.length * SCROLL_PER_CHAPTER_VH + BRAND_REVEAL_VH + 100}vh`;

  return (
    <div id="hero" style={{ height: totalHeight, background: "oklch(0.06 0.008 55)" }}>
      {/* Sticky viewport */}
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
        {/* Videos */}
        {CHAPTERS.map((c, i) => (
          <video
            key={i}
            ref={(el) => {
              videoRefs.current[i] = el;
            }}
            src={c.src}
            preload="auto"
            muted
            playsInline
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: i === chapter ? 1 : 0,
              transition: "opacity 0.48s ease",
              willChange: "opacity",
            }}
          />
        ))}

        {/* Cinematic overlay — top+bottom darkening for text legibility */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "linear-gradient(to bottom, oklch(0.04 0.008 55 / 0.45) 0%, transparent 30%, transparent 60%, oklch(0.04 0.008 55 / 0.72) 100%)",
          }}
        />
        {/* Center vignette — lifts contrast behind the title without hiding video */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(ellipse 70% 55% at 50% 50%, oklch(0.04 0.008 55 / 0.55) 0%, transparent 70%)",
          }}
        />

        {/* Chapter captions (Task 2) — each fully centered */}
        {CHAPTERS.map((c, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "0 1.5rem",
              pointerEvents: "none",
              opacity: i === chapter && textVisible ? 1 : 0,
              transform: `translateY(${i === chapter && textVisible ? 0 : 18}px)`,
              transition: "opacity 0.55s ease, transform 0.55s ease",
            }}
          >
            <h1
              style={{
                margin: 0,
                maxWidth: "16ch",
                color: "oklch(0.97 0.008 75)",
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(2.4rem, 7vw, 5.5rem)",
                fontWeight: 400,
                letterSpacing: "0.05em",
                lineHeight: 1.04,
                textShadow:
                  "0 2px 10px rgba(0,0,0,0.65), 0 8px 40px rgba(0,0,0,0.55)",
              }}
            >
              {c.title}
            </h1>
            <p
              style={{
                margin: "0.85rem 0 0",
                color: "oklch(0.86 0.04 70)",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "clamp(0.68rem, 1.6vw, 1rem)",
                fontWeight: 400,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                textShadow: "0 1px 10px rgba(0,0,0,0.75)",
              }}
            >
              {c.subtitle}
            </p>
          </div>
        ))}

        {/* Page-load brand intro (kept from original) */}
        {showIntro ? <BrandReveal topLine={COORDS} /> : null}

        {/* End-of-chapter-3 brand reveal (Task 1) — replays the same technique */}
        {brandRevealed ? (
          <BrandReveal
            key="brand-ch3"
            subtitle="Vysoké Tatry · Black Stork Golf · Slovakia"
            showScrollCue
          />
        ) : null}

        {/* Chapter progress dots */}
        <div
          style={{
            position: "absolute",
            right: "1.75rem",
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            opacity: brandRevealed ? 0 : 1,
            transition: "opacity 0.4s ease",
          }}
        >
          {CHAPTERS.map((_, i) => (
            <div
              key={i}
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: i === chapter ? "oklch(0.78 0.13 65)" : "oklch(0.92 0.008 75 / 0.30)",
                transform: i === chapter ? "scale(1.75)" : "scale(1)",
                transition: "background 0.3s ease, transform 0.3s ease",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
