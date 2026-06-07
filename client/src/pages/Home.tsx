/*
 * CHALET BEYOND — Home Page
 * Design: Nordic Brutalism / Dark Timber
 * Physical scene: Arriving at dusk, amber chalet glow against dark pine forest and Lomnický štít silhouette
 *
 * Sections:
 * 1. HeroSection — full-bleed night photo, parallax, clip-path reveal
 * 2. ChaletIntroSection — brand statement, asymmetric layout
 * 3. GallerySection — 6 photos, asymmetric grid, clip-path reveals
 * 4. AmenitiesSection — amenities grid + specs table
 * 5. LocationSection — golf, skiing, AquaCity — mountain photo bg
 * 6. BookingSection — date range calendar + booking summary
 * 7. Footer
 */
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { ChaletIntroSection } from "@/components/ChaletIntroSection";
import { GallerySection } from "@/components/GallerySection";
import { AmenitiesSection } from "@/components/AmenitiesSection";
import { QuoteSection } from "@/components/QuoteSection";
import { LocationSection } from "@/components/LocationSection";
import { BookingSection } from "@/components/BookingSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div
      className="min-h-screen"
      style={{ background: "oklch(0.10 0.012 55)", color: "oklch(0.92 0.008 75)" }}
    >
      <Navigation />
      <HeroSection />
      <ChaletIntroSection />
      <GallerySection />
      <QuoteSection />
      <AmenitiesSection />
      <LocationSection />
      <BookingSection />
      <Footer />
    </div>
  );
}
