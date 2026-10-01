import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { HeroHandoff } from "@/components/HeroHandoff";
import { ChaletIntroSection } from "@/components/ChaletIntroSection";
import { GallerySection } from "@/components/GallerySection";
import { AmenitiesSection } from "@/components/AmenitiesSection";
import { PhotoInterlude } from "@/components/PhotoInterlude";
import { GuestsProvider } from "@/contexts/GuestsContext";
import "@/components/premium/premium.css";
import { LocationSection } from "@/components/LocationSection";
import { PricingSection } from "@/components/PricingSection";
import { BookingIsland } from "@/components/premium/BookingIsland";
import { Footer } from "@/components/Footer";
import { StickyContactBar } from "@/components/StickyContactBar";

export default function Home() {
  return (
    <div
      className="min-h-screen"
      style={{
        background: "oklch(0.06 0.008 55)",
        color: "oklch(0.92 0.008 75)",
      }}
    >
      <Navigation />
      {/* The rest of the page rises over the hero as one sheet. */}
      <GuestsProvider>
        <HeroHandoff hero={<Hero />}>
          <ChaletIntroSection />

          <GallerySection />
          <PhotoInterlude />
          <AmenitiesSection />
          <LocationSection />
          {/* Price before the form: the guest should read the rate, then act on it */}
          <PricingSection />
          <BookingIsland />
          <Footer />
        </HeroHandoff>
      </GuestsProvider>
      {/* Last so it layers above everything */}
      <StickyContactBar />
    </div>
  );
}
