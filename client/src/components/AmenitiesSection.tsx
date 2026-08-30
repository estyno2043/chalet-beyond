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
  Tv, ShowerHead, Wind, Mountain, TreePine, Baby,
  Plane, Snowflake, WashingMachine, Coffee
} from "lucide-react";
import { useT } from "@/i18n/LanguageProvider";

// "Vhodné pre rodiny" is deliberately absent: Booking states cribs and extra
// beds are unavailable, so a blanket family promise sets up a complaint on
// arrival. The high chair is a fact and stands in its place.
const amenities = [
  { icon: Wifi, key: "wifi" as const },
  { icon: Car, key: "parking" as const },
  { icon: Plane, key: "transfer" as const },
  { icon: Thermometer, key: "sauna" as const },
  { icon: Waves, key: "hotTub" as const },
  { icon: Flame, key: "fireplace" as const },
  { icon: Utensils, key: "kitchen" as const },
  { icon: Coffee, key: "coffee" as const },
  { icon: Tv, key: "tv" as const },
  { icon: WashingMachine, key: "laundry" as const },
  { icon: ShowerHead, key: "bathrooms" as const },
  { icon: Snowflake, key: "skiStorage" as const },
  { icon: Wind, key: "bbq" as const },
  { icon: Mountain, key: "mountainView" as const },
  { icon: TreePine, key: "garden" as const },
  { icon: Baby, key: "highChair" as const },
];

const specs = [
  { key: "area" as const, value: "250 m²" },
  { key: "bedrooms" as const, value: "3" },
  { key: "bathrooms" as const, value: "3" },
  { key: "maxGuests" as const, value: "8" },
  { key: "checkIn" as const, value: "15:00 – 23:00" },
  { key: "checkOut" as const, value: "08:00 – 11:00" },
];

export function AmenitiesSection() {
  const t = useT();
  return (
    <section className="py-16 md:py-32" style={{ background: "oklch(0.10 0.012 55)" }}>
      <div className="container">
        <FadeUp className="mb-10 md:mb-16">
          <div className="amber-rule mb-8 md:mb-12" />
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
                {t.amenities.eyebrow}
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
                {t.amenities.headlineA}<br />
                <span style={{ color: "oklch(0.72 0.12 65)" }}>{t.amenities.headlineB}</span>
              </h2>
            </div>
          </div>
        </FadeUp>

        {/* Specs — shown inline on mobile, sidebar on desktop */}
        <FadeUp delay={0.1} className="block lg:hidden mb-8">
          <div className="grid grid-cols-3 gap-px">
            {specs.map((spec) => (
              <div
                key={t.amenities.specs[spec.key]}
                className="p-4 text-center"
                style={{
                  background: "oklch(0.14 0.012 55)",
                  borderTop: "1px solid oklch(0.72 0.12 65 / 0.18)",
                }}
              >
                <p
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "1.6rem",
                    color: "oklch(0.72 0.12 65)",
                    lineHeight: 1,
                    marginBottom: "0.3rem",
                  }}
                >
                  {spec.value}
                </p>
                <p
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.58rem",
                    letterSpacing: "0.1em",
                    color: "oklch(0.58 0.020 65)",
                    textTransform: "uppercase",
                  }}
                >
                  {t.amenities.specs[spec.key]}
                </p>
              </div>
            ))}
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
                  key={t.amenities.items[item.key]}
                  variants={staggerItem}
                  className="glow-hover flex items-center gap-3 p-4 md:p-5 group"
                  style={{
                    background: "oklch(0.14 0.012 55)",
                    borderTop: "1px solid oklch(0.72 0.12 65 / 0.12)",
                    transition: "background 0.25s cubic-bezier(0.23, 1, 0.32, 1)",
                  }}
                  whileHover={{ backgroundColor: "oklch(0.17 0.015 55)" }}
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
                    {t.amenities.items[item.key]}
                  </span>
                </motion.div>
              );
            })}
          </StaggerContainer>

          {/* Specs table */}
          <FadeUp delay={0.2}>
          <div
            className="hidden lg:block lg:w-64 p-8"
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
                {t.amenities.specsTitle}
              </h3>
              <div className="flex flex-col gap-0">
                {specs.map((spec, i) => (
                  <div
                    key={t.amenities.specs[spec.key]}
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
                      {t.amenities.specs[spec.key]}
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
