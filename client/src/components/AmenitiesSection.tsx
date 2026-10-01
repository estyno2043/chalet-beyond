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
          {[58, 31, 44].map((id, i) => (
            <figure key={id}>
              <RevealPhoto
                id={id}
                delay={i * 60}
                sizes="(min-width: 768px) 30vw, 100vw"
              />
              <figcaption>
                <h3>{c.featured[i][0]}</h3>
                <p>{c.featured[i][1]}</p>
              </figcaption>
            </figure>
          ))}
        </div>
        <ul className="amenities-list">
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
        </ul>
      </div>
    </section>
  );
}
