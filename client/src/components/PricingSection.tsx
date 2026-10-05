import { PRICE_PER_NIGHT, CHILD_PRICE_PER_NIGHT } from "@shared/pricing";
import { useGuests } from "@/contexts/GuestsContext";
import { usePremiumCopy } from "./premium/copy";
import { SectionHeader } from "./premium/SectionHeader";
import { SectionBackdrop } from "./premium/SectionBackdrop";
import { GuestCounters } from "./premium/GuestCounters";
import { Value } from "./premium/Value";
import { RollLink } from "./RollButton";
import { BlindDisclosure } from "./ui/blind-disclosure";
import { LineShadowText } from "./ui/line-shadow-text";
import { useT } from "@/i18n/LanguageProvider";

/** The whole chalet from the meadow, faint behind the prices. */
export const PRICING_BACKDROP_PHOTO_ID = 18;
/** Hatched shadow behind the price figures (hero sand, as in the intro). */
const PRICE_SHADOW = "oklch(0.85 0.06 74 / 0.5)";

export function PricingSection() {
  const c = usePremiumCopy();
  const t = useT();
  const { adults, children } = useGuests();
  const baseNight = PRICE_PER_NIGHT[adults] + children * CHILD_PRICE_PER_NIGHT;
  const startingPrice = Math.min(...Object.values(PRICE_PER_NIGHT));
  return (
    <section id="cennik" className="premium-section pricing-section">
      <SectionBackdrop
        photoId={PRICING_BACKDROP_PHOTO_ID}
        className="pricing-backdrop"
      />
      <div className="container">
        <SectionHeader lines={c.pricing} />
        <div className="pricing-split">
          <div className="price-story">
            <div className="price-figure starting-price">
              <span>{c.from}</span>
              <strong>
                <LineShadowText shadowColor={PRICE_SHADOW}>
                  {`${startingPrice} €`}
                </LineShadowText>
              </strong>
              <span>{c.night}</span>
            </div>
            <p>{c.whole}</p>
            <RollLink href="#rezervacia" tone="solid">
              {t.nav.book}
            </RollLink>
          </div>
          <div className="price-calculator">
            <GuestCounters id="pricing" />
            <div
              className="price-figure calculated-price"
              aria-live="polite"
              aria-atomic="true"
            >
              <span>{c.baseNight}</span>
              <strong>
                <Value value={`${baseNight} €`} lineShadow={PRICE_SHADOW} />
              </strong>
              <span>{c.night}</span>
            </div>
            <p className="price-offer-note">{c.weeklyNote}</p>
            <p>{c.childNote}</p>
          </div>
        </div>
        <BlindDisclosure className="price-table" summary={c.allPrices}>
          <div className="price-table__scroll">
            <table>
              <thead>
                <tr data-slat>
                  <th scope="col">{c.adults}</th>
                  <th scope="col">{c.baseNight}</th>
                </tr>
              </thead>
              <tbody>
                {[2, 3, 4, 5, 6, 7, 8].map(n => (
                  <tr key={n} data-slat>
                    <th scope="row">{n === 2 ? "1–2" : n}</th>
                    <td>{PRICE_PER_NIGHT[n]} €</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </BlindDisclosure>
        <p className="rate-note">
          <mark>{c.rateNote}</mark>
        </p>
      </div>
    </section>
  );
}
