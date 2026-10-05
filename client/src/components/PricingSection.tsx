import { PRICE_PER_NIGHT, CHILD_PRICE_PER_NIGHT } from "@shared/pricing";
import { useGuests } from "@/contexts/GuestsContext";
import { usePremiumCopy } from "./premium/copy";
import { SectionHeader } from "./premium/SectionHeader";
import { GuestCounters } from "./premium/GuestCounters";
import { Value } from "./premium/Value";
import { RollLink } from "./RollButton";
import { useT } from "@/i18n/LanguageProvider";
export function PricingSection() {
  const c = usePremiumCopy();
  const t = useT();
  const { adults, children } = useGuests();
  const baseNight = PRICE_PER_NIGHT[adults] + children * CHILD_PRICE_PER_NIGHT;
  const startingPrice = Math.min(...Object.values(PRICE_PER_NIGHT));
  return (
    <section id="cennik" className="premium-section pricing-section">
      <div className="container">
        <SectionHeader lines={c.pricing} />
        <div className="pricing-split">
          <div className="price-story">
            <p className="price-context">{c.from}</p>
            <p className="starting-price">
              {startingPrice} €<span>{c.night}</span>
            </p>
            <p>{c.whole}</p>
            <RollLink href="#rezervacia" tone="solid">
              {t.nav.book}
            </RollLink>
          </div>
          <div className="price-calculator">
            <GuestCounters id="pricing" />
            <div
              className="calculated-price"
              aria-live="polite"
              aria-atomic="true"
            >
              <span>{c.baseNight}</span>
              <strong>
                <Value value={`${baseNight} €`} />
              </strong>
              <span>{c.night}</span>
            </div>
            <p className="price-offer-note">{c.weeklyNote}</p>
            <p>{c.childNote}</p>
          </div>
        </div>
        <details className="price-table">
          <summary>
            {c.allPrices}
            <span aria-hidden="true">+</span>
          </summary>
          <div className="price-table__scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">{c.adults}</th>
                  <th scope="col">{c.baseNight}</th>
                </tr>
              </thead>
              <tbody>
                {[2, 3, 4, 5, 6, 7, 8].map(n => (
                  <tr key={n}>
                    <th scope="row">{n === 2 ? "1–2" : n}</th>
                    <td>{PRICE_PER_NIGHT[n]} €</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
        <p className="rate-note">{c.rateNote}</p>
      </div>
    </section>
  );
}
