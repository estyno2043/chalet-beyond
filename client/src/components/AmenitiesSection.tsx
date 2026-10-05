import { useT } from "@/i18n/LanguageProvider";
import { usePremiumCopy } from "./premium/copy";
import { SectionHeader } from "./premium/SectionHeader";
import { RevealPhoto } from "./premium/Photo";
import { TextAnimate } from "./ui/text-animate";
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
          ].map((text, i) => (
            // The row and its divider stay put; only the words blur in.
            <li key={text}>
              <TextAnimate
                as="span"
                by="character"
                animation="blurIn"
                once
                delay={Math.min(Math.floor(i / 2), 4) * 0.06}
              >
                {text}
              </TextAnimate>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
