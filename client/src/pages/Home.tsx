/*
 * CHALET BEYOND — Home Page
 * Design: Nordic Brutalism / Dark Timber
 * Physical scene: Arriving at dusk, amber chalet glow against dark pine forest and Lomnický štít silhouette
 *
 * Sections:
 * 0. Hero — native exterior video, property details and availability CTA
 * 1. ChaletIntroSection — "Zážitok": what Chalet Beyond is + 4 feature tiles
 * 2. TextRevealSection — scroll-driven word-by-word text reveal (Framer Motion)
 * 3. GallerySection — 5 photos, asymmetric grid
 * 4. QuoteSection — atmospheric brand quote
 * 5. AmenitiesSection — amenities grid + specs table
 * 6. LocationSection — golf, skiing, AquaCity — mountain photo bg
 * 7. BookingSection — date range calendar + booking summary
 * 8. Footer
 */
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { Navigation } from "@/components/Navigation";
import { ScrollProgressBar } from "@/components/ScrollProgressBar";
import { Hero } from "@/components/Hero";
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

  return (
    <div
      className="min-h-screen"
      style={{
        background: "oklch(0.06 0.008 55)",
        color: "oklch(0.92 0.008 75)",
      }}
    >
      <ScrollProgressBar />
      <Navigation />
      <Hero />
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
