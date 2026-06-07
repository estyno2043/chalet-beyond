/*
 * CHALET BEYOND — Amenities Section
 * Data from Booking.com: sauna, hot tub, wifi, parking, golf, skiing
 * Horizontal scrolling strip on mobile, grid on desktop
 * Stagger fade-up animations
 */
import { motion } from "framer-motion";
import { FadeUp, StaggerContainer, staggerItem } from "@/components/FadeUp";
import {
  Wifi, Car, Thermometer, Waves, Flame, Utensils,
  Tv, ShowerHead, Wind, Mountain, TreePine, Baby
} from "lucide-react";

const amenities = [
  { icon: Wifi, label: "Bezplatné WiFi" },
  { icon: Car, label: "Súkromné parkovanie" },
  { icon: Thermometer, label: "Fínska sauna" },
  { icon: Waves, label: "Vírivka / Hot tub" },
  { icon: Flame, label: "Kozub" },
  { icon: Utensils, label: "Plne vybavená kuchyňa" },
  { icon: Tv, label: "Projektor & TV" },
  { icon: ShowerHead, label: "3 kúpeľne" },
  { icon: Wind, label: "Vonkajší gril (BBQ)" },
  { icon: Mountain, label: "Výhľad na hory" },
  { icon: TreePine, label: "Záhrada & terasa" },
  { icon: Baby, label: "Vhodné pre rodiny" },
];

const specs = [
  { label: "Rozloha", value: "250 m²" },
  { label: "Spálne", value: "3" },
  { label: "Kúpeľne", value: "3" },
  { label: "Max. hostí", value: "8" },
  { label: "Check-in", value: "15:00 – 23:00" },
  { label: "Check-out", value: "08:00 – 11:00" },
];

export function AmenitiesSection() {
  return (
    <section className="py-24 md:py-32" style={{ background: "oklch(0.10 0.012 55)" }}>
      <div className="container">
        <FadeUp className="mb-16">
          <div className="amber-rule mb-12" />
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
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
                Vybavenie
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
                VŠETKO, ČO<br />
                <span style={{ color: "oklch(0.72 0.12 65)" }}>POTREBUJETE</span>
              </h2>
            </div>
          </div>
        </FadeUp>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 lg:gap-20">
          {/* Amenities grid */}
          <StaggerContainer
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-px"
            staggerDelay={0.05}
          >
            {amenities.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  variants={staggerItem}
                  className="glow-hover flex items-center gap-3 p-4"
                  style={{
                    background: "oklch(0.14 0.012 55)",
                    borderTop: "1px solid oklch(0.72 0.12 65 / 0.12)",
                  }}
                >
                  <Icon
                    size={16}
                    strokeWidth={1.5}
                    style={{ color: "oklch(0.72 0.12 65)", flexShrink: 0 }}
                  />
                  <span
                    style={{
                      fontFamily: "'Karla', sans-serif",
                      fontSize: "0.875rem",
                      fontWeight: 400,
                      color: "oklch(0.78 0.015 75)",
                    }}
                  >
                    {item.label}
                  </span>
                </motion.div>
              );
            })}
          </StaggerContainer>

          {/* Specs table */}
          <FadeUp delay={0.2}>
            <div
              className="lg:w-64 p-8"
              style={{
                background: "oklch(0.14 0.012 55)",
                border: "1px solid oklch(0.72 0.12 65 / 0.18)",
                borderRadius: "2px",
              }}
            >
              <h3
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "1.4rem",
                  letterSpacing: "0.04em",
                  color: "oklch(0.92 0.008 75)",
                  marginBottom: "1.25rem",
                }}
              >
                Parametre
              </h3>
              <div className="flex flex-col gap-0">
                {specs.map((spec, i) => (
                  <div
                    key={spec.label}
                    className="flex justify-between items-baseline py-3"
                    style={{
                      borderBottom: i < specs.length - 1 ? "1px solid oklch(0.72 0.12 65 / 0.12)" : "none",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.68rem",
                        letterSpacing: "0.1em",
                        color: "oklch(0.58 0.020 65)",
                        textTransform: "uppercase",
                      }}
                    >
                      {spec.label}
                    </span>
                    <span
                      style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: "1.1rem",
                        letterSpacing: "0.04em",
                        color: "oklch(0.72 0.12 65)",
                      }}
                    >
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
