import { GallerySection } from "../GallerySection";
import { PhotoInterlude } from "../PhotoInterlude";
import { AmenitiesSection } from "../AmenitiesSection";
import { LocationSection } from "../LocationSection";
import { PricingSection } from "../PricingSection";
import { BookingIsland } from "./BookingIsland";
import { Footer } from "../Footer";
import { useEffect } from "react";

/** Split the editorial body from the first-screen bootstrap. */
export default function PageStory({ onReady }: { onReady: () => void }) {
  useEffect(onReady, [onReady]);
  return (
    <>
      <GallerySection />
      <PhotoInterlude />
      <AmenitiesSection />
      <LocationSection />
      <PricingSection />
      <BookingIsland />
      <Footer />
    </>
  );
}
