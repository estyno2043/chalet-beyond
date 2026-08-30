/*
 * CHALET BEYOND — Footer
 * Minimal, dark timber aesthetic
 * Address, contact, social links
 */
import { FadeUp } from "@/components/FadeUp";
import { MapPin, Mail } from "lucide-react";
import { useT } from "@/i18n/LanguageProvider";

export function Footer() {
  const t = useT();
  return (
    <footer
      // pb-32 on mobile clears the fixed contact bar, which otherwise sits over
      // the copyright line at the bottom of the page. md:pb-20 restores the
      // normal spacing where the bar is not rendered.
      className="py-16 pb-32 md:py-20 md:pb-20"
      style={{
        background: "oklch(0.08 0.010 55)",
        borderTop: "1px solid oklch(0.72 0.12 65 / 0.18)",
      }}
    >
      <div className="container">
        <FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr] gap-12 mb-12">
            {/* Brand */}
            <div>
              <div className="mb-4">
                <span
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "1.8rem",
                    letterSpacing: "0.08em",
                    color: "oklch(0.92 0.008 75)",
                    display: "block",
                    lineHeight: 1.1,
                  }}
                >
                  CHALET
                </span>
                <span
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "1.8rem",
                    letterSpacing: "0.08em",
                    color: "oklch(0.72 0.12 65)",
                    display: "block",
                    lineHeight: 1.1,
                  }}
                >
                  BEYOND
                </span>
              </div>
              <p
                style={{
                  fontFamily: "'Karla', sans-serif",
                  fontSize: "0.875rem",
                  fontWeight: 300,
                  lineHeight: 1.65,
                  color: "oklch(0.58 0.020 65)",
                  maxWidth: "28ch",
                }}
              >
                {t.footer.tagline}
              </p>
            </div>

            {/* Address */}
            <div>
              <h4
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.65rem",
                  letterSpacing: "0.15em",
                  color: "oklch(0.72 0.12 65)",
                  textTransform: "uppercase",
                  marginBottom: "1rem",
                }}
              >
                {t.footer.addressLabel}
              </h4>
              <div className="flex items-start gap-2">
                <MapPin size={13} style={{ color: "oklch(0.72 0.12 65)", marginTop: "3px", flexShrink: 0 }} />
                <address
                  style={{
                    fontFamily: "'Karla', sans-serif",
                    fontSize: "0.875rem",
                    fontWeight: 300,
                    lineHeight: 1.7,
                    color: "oklch(0.58 0.020 65)",
                    fontStyle: "normal",
                  }}
                >
                  {t.footer.addressStreet}<br />
                  {t.footer.addressCity}<br />
                  {t.footer.addressCountry}
                </address>
              </div>
              <p
                className="mt-3"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.65rem",
                  letterSpacing: "0.1em",
                  color: "oklch(0.45 0.015 65)",
                }}
              >
                49°08'N 20°20'E · 820 m n.m.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.65rem",
                  letterSpacing: "0.15em",
                  color: "oklch(0.72 0.12 65)",
                  textTransform: "uppercase",
                  marginBottom: "1rem",
                }}
              >
                {t.footer.bookingLabel}
              </h4>
              <a
                href="mailto:contact@chaletbeyond.sk"
                className="flex items-center gap-2 group mb-3"
                style={{
                  fontFamily: "'Karla', sans-serif",
                  fontSize: "0.875rem",
                  fontWeight: 400,
                  color: "oklch(0.78 0.015 75)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "oklch(0.72 0.12 65)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "oklch(0.78 0.015 75)")}
              >
                <Mail size={13} style={{ flexShrink: 0 }} />
                contact@chaletbeyond.sk
              </a>
              <p
                style={{
                  fontFamily: "'Karla', sans-serif",
                  fontSize: "0.8rem",
                  fontWeight: 300,
                  color: "oklch(0.45 0.015 65)",
                  lineHeight: 1.6,
                  marginBottom: "0.75rem",
                }}
              >
                {t.footer.directOnly}
              </p>
              <p
                style={{
                  fontFamily: "'Karla', sans-serif",
                  fontSize: "0.8rem",
                  fontWeight: 300,
                  color: "oklch(0.45 0.015 65)",
                  lineHeight: 1.6,
                }}
              >
                {t.footer.airport}<br />
                {t.footer.airportDistance}
              </p>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            className="pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
            style={{ borderTop: "1px solid oklch(0.72 0.12 65 / 0.12)" }}
          >
            <div className="flex flex-col gap-1">
              <p
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.62rem",
                  letterSpacing: "0.1em",
                  color: "oklch(0.55 0.020 65)",
                  textTransform: "uppercase",
                }}
              >
                {t.footer.strip}
              </p>
              <a
                href="mailto:contact@chaletbeyond.sk"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.62rem",
                  letterSpacing: "0.1em",
                  color: "oklch(0.55 0.020 65)",
                  textDecoration: "none",
                }}
              >
                contact@chaletbeyond.sk
              </a>
            </div>
            <p
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.62rem",
                letterSpacing: "0.1em",
                color: "oklch(0.38 0.010 65)",
                textTransform: "uppercase",
              }}
            >
              {t.footer.copyright}
            </p>
          </div>
        </FadeUp>
      </div>
    </footer>
  );
}
