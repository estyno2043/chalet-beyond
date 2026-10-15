import { PRICE_PER_NIGHT } from "@shared/pricing";
import { usePremiumCopy } from "./premium/copy";
import { SectionHeader } from "./premium/SectionHeader";
import { SectionBackdrop } from "./premium/SectionBackdrop";
import { BookingIsland } from "./premium/BookingIsland";
import { BlindDisclosure } from "./ui/blind-disclosure";
import { LineShadowText } from "./ui/line-shadow-text";
import { useT } from "@/i18n/LanguageProvider";

/** The whole chalet from the meadow, faint behind the prices. */
export const PRICING_BACKDROP_PHOTO_ID = 18;
/** Hatched shadow behind the price figures (hero sand, as in the intro). */
const PRICE_SHADOW = "oklch(0.85 0.06 74 / 0.5)";

/**
 * Prices and booking as one section: the starting price and its conditions,
 * then dates, guests and the live total in one place, then the full price
 * table and the house rules for whoever wants the detail.
 */
export function PricingSection() {
  const c = usePremiumCopy();
  const t = useT();
  const startingPrice = Math.min(...Object.values(PRICE_PER_NIGHT));

  return (
    <section id="cennik" className="premium-section pricing-section">
      {/* The backdrop sits behind the price intro only, so the calendar and
          the tables below keep a plain ground. */}
      <div className="pricing-intro">
        <SectionBackdrop
          photoId={PRICING_BACKDROP_PHOTO_ID}
          className="pricing-backdrop"
        />
        <div className="container">
          <SectionHeader lines={c.pricing} />
          <div className="pricing-split">
            <div className="price-figure starting-price">
              <span>{c.from}</span>
              <strong>
                <LineShadowText shadowColor={PRICE_SHADOW}>
                  {`${startingPrice} €`}
                </LineShadowText>
              </strong>
              <span>
                {c.night} · {c.whole}
              </span>
            </div>
            <div className="price-notes">
              <p className="price-offer-note">{c.weeklyNote}</p>
              <p>{c.childNote}</p>
            </div>
          </div>
        </div>
      </div>
      <BookingIsland />
      <div className="container">
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
        <BlindDisclosure className="house-rules" summary={t.rules.title}>
          <dl>
            {[
              { label: t.rules.checkIn, value: "15:00 – 23:00" },
              { label: t.rules.checkOut, value: "08:00 – 11:00" },
              { label: t.rules.smoking, value: t.rules.smokingValue },
              { label: t.rules.pets, value: t.rules.petsValue },
              { label: t.rules.quiet, value: "23:00 – 05:00" },
              { label: t.rules.children, value: t.rules.childrenValue },
              { label: t.rules.cribs, value: t.rules.cribsValue },
              { label: t.rules.capacity, value: t.rules.capacityValue },
            ].map(rule => (
              <div key={rule.label} data-slat>
                <dt>{rule.label}</dt>
                <dd>{rule.value}</dd>
              </div>
            ))}
          </dl>
        </BlindDisclosure>
      </div>
    </section>
  );
}
