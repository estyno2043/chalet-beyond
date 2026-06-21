/*
 * CHALET BEYOND — Location Section
 * "Okolie" — golf Black Stork PGA, Tatranská Lomnica, AquaCity
 * Full-bleed mountain photo background, text overlay
 * Staggered distance cards
 */
import { motion } from "framer-motion";
import { FadeUp, StaggerContainer, staggerItem } from "@/components/FadeUp";
import { MapPin, Snowflake, Bike, Waves, Trophy } from "lucide-react";

const locations = [
  {
    icon: Trophy,
    label: "Golf Black Stork PGA",
    distance: "priamo na ihrisku",
    desc: "Jediné golfové ihrisko na Slovensku s certifikátom PGA.",
  },
  {
    icon: Snowflake,
    label: "Tatranská Lomnica",
    distance: "10 min autom",
    desc: "Skalnaté pleso, Lomnické sedlo — raj pre zimné športy.",
  },
  {
    icon: Bike,
    label: "Cyklotrasy & turistika",
    distance: "priamo z chaletu",
    desc: "Sieť dychberúcich cyklotrás a turistických chodníkov v srdci Tatier.",
  },
  {
    icon: Waves,
    label: "AquaCity Poprad",
    distance: "10 min autom",
    desc: "Termálne kúpalisko — ideálne pre rodiny s deťmi.",
  },
  {
    icon: MapPin,
    label: "Poprad-Tatry Airport",
    distance: "15 min autom",
    desc: "Priame lety z Viedne, Prahy, Varšavy a ďalších miest.",
  },
];

export function LocationSection() {
  return (
    <section id="okolie" className="relative py-24 md:py-36 overflow-hidden">
      {/* Background: zoomed Lomnický štít — same source as the gallery shot. */}
      <div className="absolute inset-0">
        <img
          src="/gallery/mountain-view.jpg"
          alt="Výhľad na Lomnický štít"
          className="w-full h-full object-cover"
          style={{ objectPosition: "center 35%", transform: "scale(1.25)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.08 0.010 55 / 0.95) 0%, oklch(0.08 0.010 55 / 0.85) 50%, oklch(0.08 0.010 55 / 0.75) 100%)",
          }}
        />
      </div>

      <div className="container relative">
        <FadeUp className="mb-16">
          <div className="amber-rule mb-12" />
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.7rem",
                  letterSpacing: "0.15em",
                  color: "oklch(0.72 0.12 65)",
                  marginBottom: "0.75rem",
                  textTransform: "uppercase",
                }}
              >
                Poloha
              </p>
              <h2
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.0,
                  color: "oklch(0.92 0.008 75)",
                }}
              >
                SRDCE<br />
                <span style={{ color: "oklch(0.72 0.12 65)" }}>TATIER</span>
              </h2>
            </div>
            <div style={{ maxWidth: "44ch" }}>
              <p
                style={{
                  fontFamily: "'Karla', sans-serif",
                  fontSize: "1.05rem",
                  fontWeight: 300,
                  lineHeight: 1.7,
                  color: "oklch(0.78 0.015 75)",
                }}
              >
                Chalet Beyond sa nachádza priamo na ihrisku Black Stork — jedinom golfovom ihrisku na Slovensku s prestížnym certifikátom PGA. Miesto, kde sa stretáva svetová úroveň golfu s neopakovateľnou scenériou Tatier.
              </p>
            </div>
          </div>
        </FadeUp>

        {/* Location cards */}
        <StaggerContainer
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          staggerDelay={0.09}
        >
          {locations.map((loc) => {
            const Icon = loc.icon;
            return (
              <motion.div
                key={loc.label}
                variants={staggerItem}
                className="glow-hover p-6"
                style={{
                  background: "oklch(0.12 0.012 55 / 0.85)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid oklch(0.72 0.12 65 / 0.15)",
                  borderRadius: "2px",
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="mt-0.5 shrink-0"
                    style={{ color: "oklch(0.72 0.12 65)" }}
                  >
                    <Icon size={18} strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                      <h3
                        style={{
                          fontFamily: "'Bebas Neue', sans-serif",
                          fontSize: "1.15rem",
                          letterSpacing: "0.03em",
                          color: "oklch(0.92 0.008 75)",
                        }}
                      >
                        {loc.label}
                      </h3>
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "0.65rem",
                          letterSpacing: "0.1em",
                          color: "oklch(0.72 0.12 65)",
                          textTransform: "uppercase",
                        }}
                      >
                        {loc.distance}
                      </span>
                    </div>
                    <p
                      style={{
                        fontFamily: "'Karla', sans-serif",
                        fontSize: "0.875rem",
                        fontWeight: 300,
                        lineHeight: 1.6,
                        color: "oklch(0.58 0.020 65)",
                      }}
                    >
                      {loc.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
