import { Photo } from "./premium/Photo";
import { SectionHeader } from "./premium/SectionHeader";
import { usePremiumCopy } from "./premium/copy";
import { RollLink } from "./RollButton";
export function LocationSection() {
  const c = usePremiumCopy();
  return (
    <section id="okolie" className="location-section">
      <Photo id={12} className="scroll-photo" />
      <div className="photo-shade" />
      <div className="container">
        <SectionHeader lines={c.location} description={c.locationBody} />
        <dl className="location-timeline">
          {c.places.map(([name, description]) => (
            <div key={name}>
              <dt>{name}</dt>
              <dd>{description}</dd>
            </div>
          ))}
        </dl>
        <RollLink
          size="sm"
          href="https://www.google.com/maps/search/?api=1&query=Chalet+Beyond+Velka+Lomnica"
          target="_blank"
          rel="noopener noreferrer"
        >
          {c.map}
        </RollLink>
      </div>
    </section>
  );
}
