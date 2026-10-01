import { SectionHeader } from "./premium/SectionHeader";
import { RevealPhoto } from "./premium/Photo";
import { usePremiumCopy } from "./premium/copy";
export function ChaletIntroSection() {
  const c = usePremiumCopy();
  return (
    <section id="chalet" className="premium-section intro-section">
      <div className="container">
        <div className="intro-split">
          <SectionHeader lines={c.intro} description={c.introBody} />
          <RevealPhoto
            id={44}
            eager
            sizes="(min-width: 1024px) 40vw, (min-width: 640px) 50vw, 100vw"
            className="intro-photo"
          />
        </div>
        <dl className="intro-facts">
          {c.facts.map(([title, text]) => (
            <div key={title}>
              <dt>{title}</dt>
              <dd>{text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
