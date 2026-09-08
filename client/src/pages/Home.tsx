/*
 * CHALET BEYOND — Home Page
 * Design: Nordic Brutalism / Dark Timber
 * Physical scene: Arriving at dusk, amber chalet glow against dark pine forest and Lomnický štít silhouette
 *
 * Sections:
 * 0. Hero — one looping shot, portrait below 1024, landscape above
 * 1. ChaletIntroSection — "Zážitok": what Chalet Beyond is + 4 feature tiles
 * 2. TextRevealSection — scroll-driven word-by-word text reveal (Framer Motion)
 * 3. GallerySection — 5 photos, asymmetric grid
 * 4. QuoteSection — atmospheric brand quote
 * 5. AmenitiesSection — amenities grid + specs table
 * 6. LocationSection — golf, skiing, AquaCity — mountain photo bg
 * 7. BookingSection — date range calendar + booking summary
 * 8. Footer
 */
import { useState, useEffect } from "react";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { Navigation } from "@/components/Navigation";
import { ScrollProgressBar } from "@/components/ScrollProgressBar";
import { Hero } from "@/components/hero/Hero";
import { HeroSCV } from "@/components/HeroSCV";
import { ChaletIntroSection } from "@/components/ChaletIntroSection";
import { TextRevealSection } from "@/components/TextRevealSection";
import { GallerySection } from "@/components/GallerySection";
import { AmenitiesSection } from "@/components/AmenitiesSection";
import { QuoteSection } from "@/components/QuoteSection";
import { LocationSection } from "@/components/LocationSection";
import { PricingSection } from "@/components/PricingSection";
import { BookingSection } from "@/components/BookingSection";
import { Footer } from "@/components/Footer";
import { StickyContactBar } from "@/components/StickyContactBar";

export default function Home() {
  useSmoothScroll();

  // Boundary is 1024, not 767: the desktop story needs the width to hold three
  // scenes and a persistent action, so tablets get the compact hero too.
  // The initializer reads the real viewport before first paint, so the wrong
  // hero never mounts and never fetches media the other one does not need.
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia("(max-width: 1023px)").matches,
  );
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 1023px)");
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{ background: "oklch(0.06 0.008 55)", color: "oklch(0.92 0.008 75)" }}
    >
      <ScrollProgressBar />
      <Navigation />
      {/* One hero, two crops of the same place: a portrait interior loop on
          phones, the landscape approach on wider screens. */}
      {isMobile ? (
        <Hero
          compact
          video="/videos/hero-mobile.mp4"
          poster="/videos/hero-mobile-poster.jpg"
        />
      ) : (
        <HeroSCV />
      )}
      {/* Rest of the landing page below the hero */}
      <ChaletIntroSection />
      {/* Scroll-driven word-by-word text reveal */}
      <TextRevealSection />
      <GallerySection />
      <QuoteSection />
      <AmenitiesSection />
      <LocationSection />
      {/* Price before the form: the guest should read the rate, then act on it */}
      <PricingSection />
      <BookingSection />
      <Footer />
      {/* Last so it layers above everything */}
      <StickyContactBar />
    </div>
  );
}
