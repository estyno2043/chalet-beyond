/*
 * CHALET BEYOND — HeroMobile
 *
 * Mobile-only hero: an interior walkthrough behind the brand reveal, with the
 * booking action on the first screen. Desktop keeps the scroll-controlled SCV
 * hero — see Home.tsx.
 *
 * The video no longer gates the first paint. It used to be preload="auto" with
 * no poster, so the guest watched a black rectangle until enough of a 6.6 MB
 * file had arrived — several seconds on mobile data, with no reason to stay.
 * Now a 95 KB poster paints immediately and the video is fetched after the
 * first frame is on screen. Same footage, just no longer in the way of it.
 */
import { useEffect, useRef, useState } from "react";
import { BrandReveal } from "@/components/BrandReveal";
import { HeroActions } from "@/components/hero/HeroActions";
import { useT } from "@/i18n/LanguageProvider";

const POSTER = "/videos/hero-mobile-poster.jpg";
const VIDEO = "/videos/hero-mobile.mp4";

export function HeroMobile() {
  const t = useT();
  const videoRef = useRef<HTMLVideoElement>(null);
  // The source is attached only after the first paint, so the browser cannot
  // start the download before the poster is up.
  const [videoSrc, setVideoSrc] = useState<string>();

  useEffect(() => {
    // Gate on visibility explicitly rather than leaning on requestAnimationFrame
    // alone: rAF does not run in a hidden tab, so a page opened in the
    // background would look like it had simply failed to start the video.
    // Wanting the same outcome is not a reason to get it by accident.
    let raf = 0;
    const start = () => {
      // One frame after we know we are visible: the poster is already decoded,
      // so this only waits for it to be on screen.
      raf = requestAnimationFrame(() => setVideoSrc(VIDEO));
    };

    if (!document.hidden) {
      start();
      return () => cancelAnimationFrame(raf);
    }

    const onVisible = () => {
      if (document.hidden) return;
      document.removeEventListener("visibilitychange", onVisible);
      start();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (!videoSrc) return;
    // iOS occasionally blocks autoplay until an explicit play() call. Failing
    // is fine — the poster stays, which is a still of this very footage.
    videoRef.current?.play().catch(() => {});
  }, [videoSrc]);

  return (
    <div
      id="hero"
      style={{
        position: "relative",
        height: "100svh",
        overflow: "hidden",
        background: "oklch(0.06 0.008 55)",
      }}
    >
      {/* poster and video share the 3:4 frame and the same object-fit, so the
          crop matches and the swap is invisible. */}
      <video
        ref={videoRef}
        src={videoSrc}
        poster={POSTER}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
        }}
      />

      {/* Legibility gradient. Deeper at the bottom than before: the actions sit
          there now and they have to read against a moving picture. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "linear-gradient(to bottom, oklch(0.04 0.008 55 / 0.55) 0%, transparent 26%, transparent 46%, oklch(0.04 0.008 55 / 0.82) 100%)",
        }}
      />

      <BrandReveal subtitle={t.hero.tagline} />

      {/* Anchored low so the brand reveal keeps the middle of the frame. */}
      <div
        className="absolute inset-x-0 flex justify-center px-6"
        style={{ bottom: "calc(2.5rem + env(safe-area-inset-bottom))" }}
      >
        <HeroActions compact />
      </div>
    </div>
  );
}
