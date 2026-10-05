import { Photo } from "./premium/Photo";
import { SectionHeader } from "./premium/SectionHeader";
import { usePremiumCopy } from "./premium/copy";
import { TextReveal } from "./ui/text-reveal";

export function LocationSection() {
  const c = usePremiumCopy();
  return (
    <section id="okolie" className="location-section">
      <Photo id={12} className="scroll-photo" />
      <div className="photo-shade" />
      <div className="container">
        <SectionHeader lines={c.location} />
        <dl className="location-timeline">
          {c.places.map(([name, description]) => (
            <div key={name}>
              <dt>{name}</dt>
              <TextReveal as="dd">{description}</TextReveal>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
