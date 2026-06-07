/*
 * CHALET BEYOND — Home Page
 * Design: Nordic Brutalism / Dark Timber
 * Physical scene: Arriving at dusk, amber chalet glow against dark pine forest and Lomnický štít silhouette
 *
 * Sections:
 * 0. ChaletCinematicHero — GSAP cinematic scroll sequence (full-screen pin)
 * 1. HeroSection — full-bleed night photo, parallax, clip-path reveal
 * 2. ChaletIntroSection — brand statement, asymmetric layout
 * 3. GallerySection — 6 photos, asymmetric grid, clip-path reveals
 * 4. QuoteSection — atmospheric brand quote
 * 5. AmenitiesSection — amenities grid + specs table
 * 6. LocationSection — golf, skiing, AquaCity — mountain photo bg
 * 7. BookingSection — date range calendar + booking summary
 * 8. Footer
 */
import { Navigation } from "@/components/Navigation";
import { ChaletCinematicHero } from "@/components/ui/cinematic-landing-hero";
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
      style={{ background: "oklch(0.06 0.008 55)", color: "oklch(0.92 0.008 75)" }}
    >
      <Navigation />
      {/* Cinematic GSAP hero — pins for ~7000px of scroll */}
      <div id="hero" />
      <ChaletCinematicHero
        heroImageUrl="/manus-storage/chalet-hero_d3d596c7.png"
        interiorImageUrl="/manus-storage/chalet-living_c24d113a.png"
        mountainImageUrl="/manus-storage/chalet-mountain-view_91debae8.png"
      />
      {/* Rest of the landing page below the cinematic hero */}
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
