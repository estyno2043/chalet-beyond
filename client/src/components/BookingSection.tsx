/*
 * CHALET BEYOND — Booking Section
 * Interactive date range calendar using react-day-picker (already in deps)
 * Check-in/check-out selection, guest count, inquiry form
 * Links to Booking.com for actual reservation
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeUp } from "@/components/FadeUp";
import { Calendar } from "@/components/ui/calendar";
import { Users, CalendarDays, ArrowRight, ExternalLink } from "lucide-react";
import type { DateRange } from "react-day-picker";

const BOOKING_URL = "https://www.booking.com/hotel/sk/chalet-beyond.html";

function formatDate(date: Date | undefined): string {
  if (!date) return "—";
  return date.toLocaleDateString("sk-SK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getNights(from: Date | undefined, to: Date | undefined): number {
  if (!from || !to) return 0;
  return Math.round((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
}

export function BookingSection() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [guests, setGuests] = useState(2);
  const [step, setStep] = useState<"calendar" | "confirm">("calendar");

  const nights = getNights(dateRange?.from, dateRange?.to);
  const canProceed = dateRange?.from && dateRange?.to && nights > 0;

  const handleBooking = () => {
    window.open(BOOKING_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <section id="rezervacia" className="py-16 md:py-36" style={{ background: "oklch(0.08 0.010 55)" }}>
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
                Rezervácia
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
                VYBERTE SI<br />
                <span style={{ color: "oklch(0.72 0.12 65)" }}>TERMÍN</span>
              </h2>
            </div>
            <p
              style={{
                fontFamily: "'Karla', sans-serif",
                fontSize: "0.95rem",
                fontWeight: 300,
                color: "oklch(0.58 0.020 65)",
                maxWidth: "38ch",
              }}
            >
              Vyberte dátumy a pokračujte na Booking.com pre záväznú rezerváciu.
            </p>
          </div>
        </FadeUp>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 md:gap-8 lg:gap-12">
          {/* Calendar */}
          <FadeUp delay={0.1}>
            <div
              className="p-4 md:p-8"
              style={{
                background: "oklch(0.12 0.012 55)",
                border: "1px solid oklch(0.72 0.12 65 / 0.18)",
                borderRadius: "2px",
              }}
            >
              <div className="flex items-center gap-2 mb-6">
                <CalendarDays size={16} style={{ color: "oklch(0.72 0.12 65)" }} />
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.7rem",
                    letterSpacing: "0.12em",
                    color: "oklch(0.58 0.020 65)",
                    textTransform: "uppercase",
                  }}
                >
                  Vyberte dátumy
                </span>
              </div>

              <div className="flex justify-center overflow-x-auto">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={1}
                  disabled={{ before: new Date() }}
                  className="rounded-none"
                  style={{
                    "--rdp-accent-color": "oklch(0.72 0.12 65)",
                    "--rdp-background-color": "oklch(0.72 0.12 65 / 0.15)",
                    color: "oklch(0.92 0.008 75)",
                  } as React.CSSProperties}
                />
              </div>

              {/* Selected range display */}
              <AnimatePresence>
                {dateRange?.from && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] }}
                    className="mt-6 pt-6"
                    style={{ borderTop: "1px solid oklch(0.72 0.12 65 / 0.18)" }}
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: "0.65rem",
                            letterSpacing: "0.12em",
                            color: "oklch(0.58 0.020 65)",
                            textTransform: "uppercase",
                            marginBottom: "0.4rem",
                          }}
                        >
                          Check-in
                        </p>
                        <p
                          style={{
                            fontFamily: "'Karla', sans-serif",
                            fontSize: "0.95rem",
                            fontWeight: 400,
                            color: "oklch(0.92 0.008 75)",
                          }}
                        >
                          {formatDate(dateRange.from)}
                        </p>
                      </div>
                      <div>
                        <p
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: "0.65rem",
                            letterSpacing: "0.12em",
                            color: "oklch(0.58 0.020 65)",
                            textTransform: "uppercase",
                            marginBottom: "0.4rem",
                          }}
                        >
                          Check-out
                        </p>
                        <p
                          style={{
                            fontFamily: "'Karla', sans-serif",
                            fontSize: "0.95rem",
                            fontWeight: 400,
                            color: "oklch(0.92 0.008 75)",
                          }}
                        >
                          {formatDate(dateRange.to)}
                        </p>
                      </div>
                    </div>
                    {nights > 0 && (
                      <p
                        className="mt-3"
                        style={{
                          fontFamily: "'Bebas Neue', sans-serif",
                          fontSize: "1.1rem",
                          letterSpacing: "0.04em",
                          color: "oklch(0.72 0.12 65)",
                        }}
                      >
                        {nights} {nights === 1 ? "noc" : nights < 5 ? "noci" : "nocí"}
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </FadeUp>

          {/* Booking summary sidebar */}
          <FadeUp delay={0.2}>
            <div
              className="p-4 md:p-8 flex flex-col gap-6"
              style={{
                background: "oklch(0.14 0.012 55)",
                border: "1px solid oklch(0.72 0.12 65 / 0.25)",
                borderRadius: "2px",
                position: "sticky",
                    top: "auto",
              }}
            >
              <div>
                <h3
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "1.6rem",
                    letterSpacing: "0.03em",
                    color: "oklch(0.92 0.008 75)",
                    marginBottom: "0.25rem",
                  }}
                >
                  Chalet Beyond
                </h3>
                <p
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.65rem",
                    letterSpacing: "0.12em",
                    color: "oklch(0.58 0.020 65)",
                    textTransform: "uppercase",
                  }}
                >
                  Veľká Lomnica, Vysoké Tatry
                </p>
              </div>

              {/* Divider */}
              <div className="amber-rule" />

              {/* Dates summary */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.65rem",
                      letterSpacing: "0.1em",
                      color: "oklch(0.58 0.020 65)",
                      textTransform: "uppercase",
                    }}
                  >
                    Check-in
                  </span>
                  <span
                    style={{
                      fontFamily: "'Karla', sans-serif",
                      fontSize: "0.875rem",
                      color: "oklch(0.78 0.015 75)",
                    }}
                  >
                    {dateRange?.from ? formatDate(dateRange.from) : "—"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.65rem",
                      letterSpacing: "0.1em",
                      color: "oklch(0.58 0.020 65)",
                      textTransform: "uppercase",
                    }}
                  >
                    Check-out
                  </span>
                  <span
                    style={{
                      fontFamily: "'Karla', sans-serif",
                      fontSize: "0.875rem",
                      color: "oklch(0.78 0.015 75)",
                    }}
                  >
                    {dateRange?.to ? formatDate(dateRange.to) : "—"}
                  </span>
                </div>
                {nights > 0 && (
                  <div className="flex justify-between items-center">
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.65rem",
                        letterSpacing: "0.1em",
                        color: "oklch(0.58 0.020 65)",
                        textTransform: "uppercase",
                      }}
                    >
                      Počet nocí
                    </span>
                    <span
                      style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: "1.2rem",
                        color: "oklch(0.72 0.12 65)",
                      }}
                    >
                      {nights}
                    </span>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="amber-rule" />

              {/* Guests */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Users size={14} style={{ color: "oklch(0.72 0.12 65)" }} />
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.65rem",
                        letterSpacing: "0.1em",
                        color: "oklch(0.58 0.020 65)",
                        textTransform: "uppercase",
                      }}
                    >
                      Hostia
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                      className="w-7 h-7 flex items-center justify-center transition-colors duration-150"
                      style={{
                        border: "1px solid oklch(0.72 0.12 65 / 0.3)",
                        color: "oklch(0.72 0.12 65)",
                        fontFamily: "'Karla', sans-serif",
                        fontSize: "1rem",
                      }}
                    >
                      −
                    </button>
                    <span
                      style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: "1.3rem",
                        color: "oklch(0.92 0.008 75)",
                        minWidth: "1.5rem",
                        textAlign: "center",
                      }}
                    >
                      {guests}
                    </span>
                    <button
                      onClick={() => setGuests(Math.min(8, guests + 1))}
                      className="w-7 h-7 flex items-center justify-center transition-colors duration-150"
                      style={{
                        border: "1px solid oklch(0.72 0.12 65 / 0.3)",
                        color: "oklch(0.72 0.12 65)",
                        fontFamily: "'Karla', sans-serif",
                        fontSize: "1rem",
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
                <p
                  style={{
                    fontFamily: "'Karla', sans-serif",
                    fontSize: "0.75rem",
                    fontWeight: 300,
                    color: "oklch(0.45 0.015 65)",
                  }}
                >
                  Max. 8 hostí
                </p>
              </div>

              {/* CTA */}
              <motion.button
                onClick={handleBooking}
                className="w-full btn-amber justify-center gap-3 mt-2"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  opacity: canProceed ? 1 : 0.5,
                  pointerEvents: canProceed ? "auto" : "none",
                }}
              >
                <span>Rezervovať na Booking</span>
                <ExternalLink size={14} />
              </motion.button>

              {!canProceed && (
                <p
                  style={{
                    fontFamily: "'Karla', sans-serif",
                    fontSize: "0.75rem",
                    fontWeight: 300,
                    color: "oklch(0.45 0.015 65)",
                    textAlign: "center",
                  }}
                >
                  Vyberte dátumy pre pokračovanie
                </p>
              )}

              <p
                style={{
                  fontFamily: "'Karla', sans-serif",
                  fontSize: "0.75rem",
                  fontWeight: 300,
                  color: "oklch(0.45 0.015 65)",
                  textAlign: "center",
                }}
              >
                Rezervácia prebieha cez Booking.com
              </p>
            </div>
          </FadeUp>
        </div>

        {/* House rules */}
        <FadeUp delay={0.1} className="mt-12">
          <div
            className="p-6 md:p-8"
            style={{
              background: "oklch(0.12 0.012 55)",
              border: "1px solid oklch(0.72 0.12 65 / 0.12)",
              borderRadius: "2px",
            }}
          >
            <h3
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "1.3rem",
                letterSpacing: "0.04em",
                color: "oklch(0.92 0.008 75)",
                marginBottom: "1rem",
              }}
            >
              Pravidlá domu
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Check-in", value: "15:00 – 23:00" },
                { label: "Check-out", value: "08:00 – 11:00" },
                { label: "Fajčenie", value: "Zakázané" },
                { label: "Domáce zvieratá", value: "Nie sú povolené" },
                { label: "Ticho", value: "23:00 – 05:00" },
                { label: "Vek", value: "Bez obmedzenia" },
                { label: "Deti", value: "Vítané" },
                { label: "Kapacita", value: "Max. 8 osôb" },
              ].map((rule) => (
                <div key={rule.label}>
                  <p
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.62rem",
                      letterSpacing: "0.1em",
                      color: "oklch(0.58 0.020 65)",
                      textTransform: "uppercase",
                      marginBottom: "0.3rem",
                    }}
                  >
                    {rule.label}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Karla', sans-serif",
                      fontSize: "0.9rem",
                      fontWeight: 400,
                      color: "oklch(0.78 0.015 75)",
                    }}
                  >
                    {rule.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
