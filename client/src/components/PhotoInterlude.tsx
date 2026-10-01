import { Photo } from "./premium/Photo";
import { SectionHeader } from "./premium/SectionHeader";
import { usePremiumCopy } from "./premium/copy";
export function PhotoInterlude() {
  const c = usePremiumCopy();
  return (
    <section className="photo-interlude">
      <Photo id={72} className="scroll-photo" />
      <div className="photo-shade" />
      <div className="container">
        <SectionHeader lines={c.interlude} />
      </div>
    </section>
  );
}
