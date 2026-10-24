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
              <div className="mb-3.5 p-3.5 rounded-xl bg-[oklch(0.72_0.12_65/0.14)] border border-[oklch(0.72_0.12_65/0.4)] flex flex-col gap-1.5 shadow-lg">
                <div className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-[var(--amber)]" aria-hidden="true" />
                  <span className="text-[var(--amber)] text-xs font-mono font-semibold tracking-widest uppercase">
                    Novembrová akcia · Zľava −20 %
                  </span>
                </div>
                <p className="text-xs font-['Karla',sans-serif] text-[oklch(0.97_0.007_75)] leading-relaxed">
                  Cena od <strong className="text-[var(--amber)] text-sm font-semibold">240 €</strong> / noc <span className="line-through opacity-60 text-xs">300 €</span> za celý súkromný objekt s wellnessom.
                  Zľava sa započíta automaticky pri výbere novembrových dní v kalendári.
                </p>
              </div>
              <p className="price-offer-note">{c.weeklyNote}</p>
              <p>{c.childNote}</p>
              <a
                href="#rezervacia"
                onClick={e => {
                  e.preventDefault();
                  void import("@/lib/smooth-scroll").then(m => m.scrollTo("#rezervacia"));
                }}
                className="mt-3 inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[var(--amber)] hover:text-white transition-colors group"
              >
                <span>Vybrať termín v kalendári nižšie</span>
                <span className="transform group-hover:translate-y-0.5 transition-transform" aria-hidden="true">↓</span>
              </a>
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
