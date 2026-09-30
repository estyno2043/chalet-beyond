import { useEffect, useRef, useState } from "react";
import { ArrowRight, Pause, Play } from "lucide-react";
import { useT } from "@/i18n/LanguageProvider";
import { HeroPointer } from "./HeroPointer";
import "./hero.css";

const POSTER = "/media/hero/exterior-poster-v1.webp";
const DESKTOP_VIDEO = "/media/hero/exterior-720p60-v1.mp4";
const COMPACT_VIDEO = "/media/hero/exterior-720p30-v1.mp4";

type Connection = EventTarget & { saveData?: boolean; effectiveType?: string };
const connection = () =>
  (navigator as Navigator & { connection?: Connection }).connection;

function readMediaPreferences() {
  const desktop = window.matchMedia("(min-width: 1024px)").matches;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const network = connection();
  const constrained =
    network?.saveData ||
    ["slow-2g", "2g", "3g"].includes(network?.effectiveType ?? "");
  return { desktop, autoplay: desktop && !reduced && !constrained };
}

/** One decoder. No scroll seeking, canvas, continuous JS loop or player SDK. */
export function Hero() {
  const t = useT();
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(false);
  const [preferences, setPreferences] = useState(readMediaPreferences);
  const [requested, setRequested] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [hasFrame, setHasFrame] = useState(false);
  const [failed, setFailed] = useState(false);
  const enabled = preferences.autoplay || requested;
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

  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    setHasFrame(false);
    setPlaying(false);
    setFailed(false);
    if (!video || !section || !enabled) return;

    let disposed = false;
    const rect = section.getBoundingClientRect();
    let inView = rect.bottom > 0 && rect.top < window.innerHeight;
    let frameRequest: number | undefined;

    const syncPlayback = () => {
      if (!inView || document.hidden || userPaused.current) {
        video.pause();
        return;
      }
      void video.play().catch(() => {
        // Autoplay is a request. Poster and an explicit play control remain.
        if (!disposed) setPlaying(false);
      });
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
      setPlaying(true);
      setFailed(false);
    };
    const paused = () => setPlaying(false);
    const error = () => {
      setFailed(true);
      setHasFrame(false);
      setPlaying(false);
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      syncPlayback();
    });
    observer.observe(section);
    document.addEventListener("visibilitychange", syncPlayback);
    video.addEventListener("playing", revealFrame);
    video.addEventListener("pause", paused);
    video.addEventListener("error", error);
    syncPlayback();

    return () => {
      disposed = true;
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncPlayback);
      video.removeEventListener("playing", revealFrame);
      video.removeEventListener("pause", paused);
      video.removeEventListener("error", error);
      if (frameRequest !== undefined)
        video.cancelVideoFrameCallback(frameRequest);
      video.pause();
    };
  }, [enabled, source]);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!enabled) {
      userPaused.current = false;
      setRequested(true);
      return;
    }
    if (!video) return;
    if (!video.paused) {
      userPaused.current = true;
      video.pause();
    } else {
      userPaused.current = false;
      if (failed) video.load();
      void video.play().catch(() => setPlaying(false));
    }
  };

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="chalet-hero"
      aria-labelledby="hero-title"
    >
      <div className="chalet-hero__media" aria-hidden="true">
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

      <div className="chalet-hero__layout">
        <div className="chalet-hero__content">
          <h1
            id="hero-title"
            className="chalet-hero__title"
            aria-label="Chalet Beyond"
          >
            <span className="chalet-hero__line">
              <span>CHALET</span>
            </span>
            <span className="chalet-hero__line">
              <span>BEYOND</span>
            </span>
          </h1>
          <p className="chalet-hero__description">{t.hero.description}</p>
          <ul className="chalet-hero__facts" aria-label={t.hero.factsLabel}>
            <li>250 m²</li>
            <li>{t.hero.bedrooms}</li>
            <li>{t.hero.guests}</li>
          </ul>
          <div className="chalet-hero__actions">
            <a
              href="#rezervacia"
              className="chalet-hero__primary"
              data-hero-magnetic
            >
              <span className="chalet-hero__reactive-content">
                {t.hero.availability}
                <ArrowRight size={19} strokeWidth={1.7} aria-hidden="true" />
              </span>
            </a>
            <a
              href="#priestory"
              className="chalet-hero__secondary"
              data-hero-magnetic
            >
              <span className="chalet-hero__reactive-content">
                {t.hero.explore}
              </span>
            </a>
          </div>
        </div>
        <button
          type="button"
          onClick={togglePlayback}
          className="chalet-hero__playback"
          data-hero-magnetic
          aria-label={playing ? t.hero.pauseVideo : t.hero.playVideo}
        >
          <span className="chalet-hero__reactive-content">
            {playing ? (
              <Pause size={16} strokeWidth={1.7} aria-hidden="true" />
            ) : (
              <Play size={16} strokeWidth={1.7} aria-hidden="true" />
            )}
            <span>{playing ? t.hero.pauseVideo : t.hero.playVideo}</span>
          </span>
        </button>
      </div>
      <HeroPointer surface={sectionRef} />
    </section>
  );
}
