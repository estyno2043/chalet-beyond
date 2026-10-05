import { RevealList } from "./premium/RevealList";
import { useT } from "@/i18n/LanguageProvider";
import { usePremiumCopy } from "./premium/copy";
import { SectionHeader } from "./premium/SectionHeader";
import { RevealPhoto } from "./premium/Photo";
export function AmenitiesSection() {
  const t = useT();
  const c = usePremiumCopy();
  const items = t.amenities.items;
  return (
    <section id="vybavenie" className="premium-section amenities-section">
      <div className="container">
        <SectionHeader lines={c.amenities} description={c.amenitiesBody} />
        <div className="featured-amenities">
          {[58, 33, 44].map((id, i) => (
            <figure key={id}>
              <RevealPhoto
                id={id}
                className={`featured-amenity--${id}`}
                sizes="(min-width: 768px) 30vw, 100vw"
              />
              <figcaption>
                <h3>{c.featured[i]}</h3>
              </figcaption>
            </figure>
          ))}
        </div>
        <RevealList>
          {[
            items.wifi,
            items.parking,
            items.kitchen,
            items.coffee,
            items.tv,
            items.laundry,
            items.bathrooms,
            items.skiStorage,
            items.bbq,
            items.garden,
            items.highChair,
          ].map(text => (
            <li key={text}>{text}</li>
          ))}
        </RevealList>
      </div>
    </section>
  );
}
