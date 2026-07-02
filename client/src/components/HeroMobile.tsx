/*
 * CHALET BEYOND — HeroMobile
 * Mobile-only hero: full-screen looping interior walkthrough video with the
 * animated CHALET BEYOND brand reveal on top (same technique as the intro).
 * Desktop keeps the scroll-controlled SCV hero — see Home.tsx.
 */
import { useEffect, useRef } from "react";
import { BrandReveal } from "@/components/BrandReveal";

export function HeroMobile() {
  const videoRef = useRef<HTMLVideoElement>(null);

  // iOS occasionally blocks autoplay until an explicit play() call.
  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, []);

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
      <video
        ref={videoRef}
        src="/videos/hero-mobile.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
        }}
      />

      {/* Legibility gradient — dark top for the nav, dark bottom for the cue */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "linear-gradient(to bottom, oklch(0.04 0.008 55 / 0.5) 0%, transparent 28%, transparent 62%, oklch(0.04 0.008 55 / 0.7) 100%)",
        }}
      />

      {/* Animated brand identity — same reveal technique as the page intro */}
      <BrandReveal
        subtitle="Vysoké Tatry · Black Stork Golf · Slovakia"
        showScrollCue
      />
    </div>
  );
}
