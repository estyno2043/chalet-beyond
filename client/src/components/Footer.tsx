/*
 * CHALET BEYOND — Footer
 * Minimal, dark timber aesthetic
 * Address, contact, social links
 */
import { FadeUp } from "@/components/FadeUp";
import { MapPin, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer
      className="py-16 md:py-20"
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
                Beyond your expectations. V srdci Vysokých Tatier.
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
                Adresa
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
                  Kamenná 2004/25A<br />
                  059 52 Veľká Lomnica<br />
                  Slovensko
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
                49°11'N 20°17'E · 820 m n.m.
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
                Rezervácia
              </h4>
              <a
                href="https://www.booking.com/hotel/sk/chalet-beyond.html"
                target="_blank"
                rel="noopener noreferrer"
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
                <ExternalLink size={13} style={{ flexShrink: 0 }} />
                Booking.com
              </a>
              <p
                style={{
                  fontFamily: "'Karla', sans-serif",
                  fontSize: "0.8rem",
                  fontWeight: 300,
                  color: "oklch(0.45 0.015 65)",
                  lineHeight: 1.6,
                }}
              >
                Letisko Poprad-Tatry<br />
                15 min autom
              </p>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            className="pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
            style={{ borderTop: "1px solid oklch(0.72 0.12 65 / 0.12)" }}
          >
            <p
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.62rem",
                letterSpacing: "0.1em",
                color: "oklch(0.38 0.010 65)",
                textTransform: "uppercase",
              }}
            >
              © 2025 Chalet Beyond · Veľká Lomnica · Slovensko
            </p>
            <p
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.62rem",
                letterSpacing: "0.1em",
                color: "oklch(0.38 0.010 65)",
                textTransform: "uppercase",
              }}
            >
              Black Stork Golf Resort · PGA Certified
            </p>
          </div>
        </FadeUp>
      </div>
    </footer>
  );
}
