/*
 * CHALET BEYOND — Pricing Section
 * Direct rates against Booking.com, so the saving from booking here is explicit.
 */
import { FadeUp } from "@/components/FadeUp";
import {
  BOOKING_PRICE_PER_NIGHT,
  MAX_GUESTS,
  PRICE_PER_NIGHT,
} from "@shared/pricing";
import { useT } from "@/i18n/LanguageProvider";

const MONO = "'JetBrains Mono', monospace";
const AMBER = "oklch(0.72 0.12 65)";
const MUTED = "oklch(0.58 0.020 65)";

// From two guests upwards: Booking publishes no single-guest tier, and the
// solo rate is the two-guest one, so a "1" row would just repeat the next line.
const rows = Array.from({ length: MAX_GUESTS - 1 }, (_, i) => {
  const guests = i + 2;
  return {
    guests,
    direct: PRICE_PER_NIGHT[guests],
    booking: BOOKING_PRICE_PER_NIGHT[guests],
  };
});



export function PricingSection() {
  const t = useT();
  return (
    <section
      id="cennik"
      className="py-16 md:py-32"
      style={{ background: "oklch(0.08 0.010 55)" }}
    >
      <div className="container">
        <FadeUp className="mb-10 md:mb-16">
          <div className="amber-rule mb-8 md:mb-12" />
          <p
            style={{
              fontFamily: MONO,
              fontSize: "0.7rem",
              letterSpacing: "0.15em",
              color: AMBER,
              marginBottom: "0.75rem",
              textTransform: "uppercase",
            }}
          >
            {t.pricing.eyebrow}
          </p>
          <h2
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
              lineHeight: 1.0,
              letterSpacing: "-0.01em",
              color: "oklch(0.92 0.008 75)",
            }}
          >
            {t.pricing.headlineA}
            <br />
            <span style={{ color: AMBER }}>{t.pricing.headlineB}</span>
          </h2>
          <p
            style={{
              fontFamily: "'Karla', sans-serif",
              fontSize: "0.95rem",
              fontWeight: 300,
              lineHeight: 1.7,
              color: "oklch(0.62 0.020 65)",
              maxWidth: "46ch",
              marginTop: "1.25rem",
            }}
          >
            {t.pricing.body}
          </p>
        </FadeUp>

        <FadeUp delay={0.1}>
          {/* Mobile default: one card per tier. A 480px table forces the direct
              price and the saving off a 375px screen, leaving only Booking's
              higher rate readable — the opposite of what this section argues.
              Cards lead with the direct price; the table returns at md. */}
          <div className="md:hidden flex flex-col gap-px">
            {rows.map(({ guests, direct, booking }) => (
              <div
                key={guests}
                className="flex items-center justify-between gap-4 p-4"
                style={{
                  background: "oklch(0.12 0.012 55)",
                  border: "1px solid oklch(0.72 0.12 65 / 0.18)",
                  borderRadius: "2px",
                }}
              >
                <div>
                  <p
                    style={{
                      fontFamily: MONO,
                      fontSize: "0.7rem",
                      letterSpacing: "0.1em",
                      color: "oklch(0.78 0.015 75)",
                      textTransform: "uppercase",
                    }}
                  >
                    {`${guests} ${guests < 5 ? t.pricing.guestsFew : t.pricing.guestsMany}`}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Karla', sans-serif",
                      fontSize: "0.8rem",
                      fontWeight: 300,
                      color: MUTED,
                      marginTop: "0.35rem",
                    }}
                  >
                    <span style={{ textDecoration: "line-through" }}>
                      {booking} €
                    </span>{" "}
                    {t.pricing.onBooking}
                  </p>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: "1.75rem",
                      lineHeight: 1,
                      letterSpacing: "0.02em",
                      color: "oklch(0.92 0.008 75)",
                    }}
                  >
                    {direct} €
                  </p>
                  <p
                    style={{
                      fontFamily: "'Karla', sans-serif",
                      fontSize: "0.8rem",
                      color: AMBER,
                      marginTop: "0.3rem",
                    }}
                  >
                    {t.pricing.youSave} {booking - direct} €
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div
            className="hidden md:block overflow-x-auto"
            style={{
              background: "oklch(0.12 0.012 55)",
              border: "1px solid oklch(0.72 0.12 65 / 0.18)",
              borderRadius: "2px",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "30rem",
              }}
            >
              <thead>
                <tr>
                  {[t.pricing.colGuests, t.pricing.colBooking, t.pricing.colDirect, t.pricing.colSaving].map(
                    (head) => (
                      <th
                        key={head}
                        style={{
                          fontFamily: MONO,
                          fontSize: "0.62rem",
                          letterSpacing: "0.1em",
                          color: MUTED,
                          textTransform: "uppercase",
                          textAlign: head === t.pricing.colGuests ? "left" : "right",
                          padding: "1rem 1.25rem",
                          borderBottom: "1px solid oklch(0.72 0.12 65 / 0.18)",
                          fontWeight: 400,
                        }}
                      >
                        {head}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {rows.map(({ guests, direct, booking }) => (
                  <tr key={guests}>
                    <td
                      style={{
                        fontFamily: MONO,
                        fontSize: "0.85rem",
                        color: "oklch(0.78 0.015 75)",
                        padding: "0.85rem 1.25rem",
                      }}
                    >
                      {guests}
                    </td>
                    <td
                      style={{
                        fontFamily: "'Karla', sans-serif",
                        fontSize: "0.9rem",
                        color: MUTED,
                        textDecoration: "line-through",
                        textAlign: "right",
                        padding: "0.85rem 1.25rem",
                      }}
                    >
                      {booking} €
                    </td>
                    <td
                      style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: "1.25rem",
                        letterSpacing: "0.02em",
                        color: "oklch(0.92 0.008 75)",
                        textAlign: "right",
                        padding: "0.85rem 1.25rem",
                      }}
                    >
                      {direct} €
                    </td>
                    <td
                      style={{
                        fontFamily: "'Karla', sans-serif",
                        fontSize: "0.9rem",
                        color: AMBER,
                        textAlign: "right",
                        padding: "0.85rem 1.25rem",
                      }}
                    >
                      −{booking - direct} €
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p
            style={{
              fontFamily: "'Karla', sans-serif",
              fontSize: "0.75rem",
              fontWeight: 300,
              color: "oklch(0.45 0.015 65)",
              marginTop: "1rem",
              lineHeight: 1.6,
            }}
          >
            {t.pricing.finePrint}
          </p>
        </FadeUp>
      </div>
    </section>
  );
}
