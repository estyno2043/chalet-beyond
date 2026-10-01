import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { CalendarDays, Star } from "lucide-react";
import { useT } from "@/i18n/LanguageProvider";
import {
  BOOKING_LISTING_URL,
  BOOKING_RATING,
  PHONE,
  PHONE_DISPLAY,
} from "@shared/contact";
import { PRICE_PER_NIGHT } from "@shared/pricing";
import { HeroPointer } from "./HeroPointer";
import { RollLink } from "./RollButton";
import "./hero.css";

const POSTER = "/media/hero/exterior-poster-v1.webp";
const DESKTOP_VIDEO = "/media/hero/exterior-720p60-v1.mp4";
const COMPACT_VIDEO = "/media/hero/exterior-720p30-v1.mp4";

/** Lowest nightly rate for the whole chalet, read from the same table the pricing section uses. */
const PRICE_FROM = Math.min(...Object.values(PRICE_PER_NIGHT));

const LINES = ["CHALET", "BEYOND"] as const;

/*
 * Title entrance. Every letter appears at the hero's centre and glides left
 * into its slot; CHALET runs first, BEYOND follows once CHALET is mostly home.
 * The whole sequence is ~1.3 s — about what the first video frame needs — so
 * the wait reads as choreography instead of a loading poster.
 */
const LETTER_MS = 680;
const LETTER_STAGGER_MS = 34;
/** BEYOND starts when CHALET's last letter is halfway in: a short gap, not a pause. */
const SECOND_LINE_AT_MS =
  (LINES[0].length - 1) * LETTER_STAGGER_MS + LETTER_MS * 0.5;
/** Share of each letter's time spent appearing at the centre before it glides. */
const APPEAR_AT = 0.16;
/** Quint out: long enough a tail that the glide reads as travel, not a jump. */
const EASE_GLIDE = "cubic-bezier(0.22, 1, 0.36, 1)";
/** The curtain never lifts before the title has started to land, nor waits past this. */
const CURTAIN_MIN_MS = 650;
const CURTAIN_MAX_MS = 1600;

type Connection = EventTarget & { saveData?: boolean };
const connection = () =>
  (navigator as Navigator & { connection?: Connection }).connection;

function readMediaPreferences() {
  const desktop = window.matchMedia("(min-width: 1024px)").matches;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Save-Data is an explicit choice by the guest; it is the one signal that
  // still keeps the video from starting on its own.
  const saveData = Boolean(connection()?.saveData);
  return { desktop, reduced, autoplay: !reduced && !saveData };
}

/** One decoder. No scroll seeking, canvas, continuous JS loop or player SDK. */
export function Hero() {
  const t = useT();
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const mountedAt = useRef(performance.now());
  const [preferences, setPreferences] = useState(readMediaPreferences);
  const [hasFrame, setHasFrame] = useState(false);
  const [failed, setFailed] = useState(false);
  // Reduced motion skips the whole entrance, curtain included.
  const [intro] = useState(() => !preferences.reduced);
  const [curtainUp, setCurtainUp] = useState(() => preferences.reduced);
  const enabled = preferences.autoplay;
  const source = preferences.desktop ? DESKTOP_VIDEO : COMPACT_VIDEO;

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const network = connection();
    const update = () => setPreferences(readMediaPreferences());
    desktop.addEventListener("change", update);
    reduced.addEventListener("change", update);
    network?.addEventListener("change", update);
    return () => {
      desktop.removeEventListener("change", update);
      reduced.removeEventListener("change", update);
      network?.removeEventListener("change", update);
    };
  }, []);

  // Letters: measured once the display face is in, so every letter starts from
  // the real centre and lands on its real slot. WAAPI keeps it on the
  // compositor while the video and the rest of the page are still loading.
  useLayoutEffect(() => {
    const title = titleRef.current;
    const section = sectionRef.current;
    if (!intro || !title || !section) return;

    let cancelled = false;
    const animations: Animation[] = [];
    const start = () => {
      if (cancelled) return;
      const centre = section.getBoundingClientRect();
      const centreX = centre.left + centre.width / 2;
      title.querySelectorAll<HTMLElement>("[data-line]").forEach(line => {
        const lineIndex = Number(line.dataset.line);
        const lineDelay = lineIndex * SECOND_LINE_AT_MS;
        line.querySelectorAll<HTMLElement>("[data-letter]").forEach((letter, i) => {
          const box = letter.getBoundingClientRect();
          const dx = centreX - (box.left + box.width / 2);
          animations.push(
            letter.animate(
              [
                // Born at the centre: fades up almost in place…
                {
                  opacity: 0,
                  transform: `translate3d(${dx}px, 0, 0) scale(1.06)`,
                  filter: "blur(8px)",
                  easing: "ease-out",
                },
                {
                  opacity: 1,
                  transform: `translate3d(${dx * 0.94}px, 0, 0) scale(1.04)`,
                  filter: "blur(3px)",
                  offset: APPEAR_AT,
                  easing: EASE_GLIDE,
                },
                // …then glides left into its slot and sharpens on arrival.
                {
                  opacity: 1,
                  transform: "translate3d(0, 0, 0) scale(1)",
                  filter: "blur(0px)",
                },
              ],
              {
                duration: LETTER_MS,
                delay: lineDelay + i * LETTER_STAGGER_MS,
                fill: "backwards",
              }
            )
          );
        });
      });
      title.dataset.intro = "running";
    };

    // A slow font must not hold the title hostage: after 700 ms the letters go
    // with whatever face is on screen.
    const fontReady = document.fonts?.load("600 1em Thunder") ?? Promise.resolve();
    const fallback = new Promise(resolve => setTimeout(resolve, 700));
    void Promise.race([fontReady, fallback]).then(start, start);

    return () => {
      cancelled = true;
      animations.forEach(animation => animation.cancel());
    };
  }, [intro]);

  // Curtain: lifts on the first decoded frame, but not before the title has
  // started landing, and never later than CURTAIN_MAX_MS (poster underneath).
  useEffect(() => {
    if (curtainUp) return;
    const elapsed = performance.now() - mountedAt.current;
    const lift = (at: number) =>
      setTimeout(() => setCurtainUp(true), Math.max(0, at - elapsed));
    const ceiling = lift(CURTAIN_MAX_MS);
    // Nothing to wait for once a frame is decoded, the video failed, or it
    // is not going to load at all (Save-Data).
    const floor =
      hasFrame || failed || !enabled ? lift(CURTAIN_MIN_MS) : undefined;
    return () => {
      clearTimeout(ceiling);
      if (floor) clearTimeout(floor);
    };
  }, [curtainUp, hasFrame, failed, enabled]);

  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    setHasFrame(false);
    setFailed(false);
    if (!video || !section || !enabled) return;

    let disposed = false;
    const rect = section.getBoundingClientRect();
    let inView = rect.bottom > 0 && rect.top < window.innerHeight;
    let frameRequest: number | undefined;

    const syncPlayback = () => {
      if (!inView || document.hidden) {
        video.pause();
        return;
      }
      // Muted is set as a property as well: autoplay policies check the
      // property, and React only reflects `muted` that way after mount.
      video.muted = true;
      // Autoplay is a request; if the browser refuses, the poster stays.
      void video.play().catch(() => {});
    };
    const revealFrame = () => {
      if ("requestVideoFrameCallback" in video) {
        if (frameRequest !== undefined)
          video.cancelVideoFrameCallback(frameRequest);
        frameRequest = video.requestVideoFrameCallback(() => {
          if (!disposed) setHasFrame(true);
        });
      } else {
        setHasFrame(true);
      }
      setFailed(false);
    };
    const error = () => {
      setFailed(true);
      setHasFrame(false);
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      syncPlayback();
    });
    observer.observe(section);
    document.addEventListener("visibilitychange", syncPlayback);
    video.addEventListener("playing", revealFrame);
    video.addEventListener("error", error);
    syncPlayback();

    return () => {
      disposed = true;
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncPlayback);
      video.removeEventListener("playing", revealFrame);
      video.removeEventListener("error", error);
      if (frameRequest !== undefined)
        video.cancelVideoFrameCallback(frameRequest);
      video.pause();
    };
  }, [enabled, source]);


  const stats = [
    {
      value: (
        <>
          {BOOKING_RATING}/10
          <Star
            size={20}
            strokeWidth={1.4}
            className="chalet-hero__star"
            aria-hidden="true"
          />
        </>
      ),
      label: (
        <a href={BOOKING_LISTING_URL} target="_blank" rel="noreferrer">
          {t.hero.statRating}
        </a>
      ),
    },
    {
      value: (
        <>
          <small>{t.hero.statPriceFrom}</small>
          {t.hero.statPriceValue.replace("{price}", String(PRICE_FROM))}
        </>
      ),
      label: t.hero.statPrice,
    },
    { value: "250 m²", label: t.hero.statSize },
    { value: t.hero.statCancelValue, label: t.hero.statCancel },
  ];

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="chalet-hero"
      aria-labelledby="hero-title"
      data-intro={intro ? "on" : "off"}
    >
      <div
        className="chalet-hero__media"
        aria-hidden="true"
        data-settled={curtainUp}
      >
        <img
          src={POSTER}
          alt=""
          width={1600}
          height={900}
          fetchPriority="high"
          className="chalet-hero__poster"
        />
        {enabled && (
          <video
            key={source}
            ref={videoRef}
            src={source}
            muted
            autoPlay
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
            tabIndex={-1}
            className="chalet-hero__video"
            data-ready={hasFrame}
          />
        )}
      </div>
      <div className="chalet-hero__shade" aria-hidden="true" />
      <div
        className="chalet-hero__curtain"
        aria-hidden="true"
        data-up={curtainUp}
      />

      <div className="chalet-hero__layout">
        <div className="chalet-hero__content">
          <h1
            id="hero-title"
            ref={titleRef}
            className="chalet-hero__title"
            aria-label="Chalet Beyond"
            data-intro={intro ? "pending" : "off"}
          >
            {LINES.map((word, lineIndex) => (
              <span
                key={word}
                className="chalet-hero__line"
                data-line={lineIndex}
                aria-hidden="true"
              >
                {word.split("").map((letter, i) => (
                  <span key={i} className="chalet-hero__letter" data-letter>
                    {letter}
                  </span>
                ))}
              </span>
            ))}
          </h1>
          <p className="chalet-hero__description" data-reveal="1">
            {t.hero.description}
          </p>

          <div className="chalet-hero__actions" data-reveal="2">
            <RollLink
              href="#rezervacia"
              icon={
                <CalendarDays size={16} strokeWidth={1.5} aria-hidden="true" />
              }
            >
              {t.hero.offerCta}
            </RollLink>
            <div className="chalet-hero__direct">
              <span className="chalet-hero__direct-label">
                {t.hero.directLabel}
              </span>
              <a
                href={`tel:${PHONE}`}
                className="chalet-hero__direct-phone"
                aria-label={`${t.contact.callAria} ${PHONE_DISPLAY}`}
              >
                {PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </div>

        <div className="chalet-hero__footer">
          <dl className="chalet-hero__stats" aria-label={t.hero.statsLabel}>
            {stats.map((stat, i) => (
              <div
                key={i}
                className="chalet-hero__stat"
                data-reveal={String(3 + i)}
              >
                <dt>{stat.label}</dt>
                <dd>{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <HeroPointer surface={sectionRef} />
    </section>
  );
}
